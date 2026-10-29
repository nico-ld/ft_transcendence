from typing import Annotated

from db import users_db
from db.friends import friends_db
from fastapi import APIRouter, HTTPException, Query, status
from fastapi.concurrency import run_in_threadpool
from realtime import manager
from schemas import FriendsOut, PublicUserOut, Relation, RelationOut, UserSearchOut
from security import CurrentUser
from sqlalchemy.exc import IntegrityError

router = APIRouter(prefix="/friends", tags=["friends"])

SEARCH_LIMIT = 10


def relations(user_id: int) -> dict[int, Relation]:
    """What each user with a request to or from user_id is to them"""
    sent, received = friends_db.requests(user_id)
    found: dict[int, Relation] = {}
    for other in sent | received:
        if other not in received:
            found[other] = "outgoing"
        elif other not in sent:
            found[other] = "incoming"
        else:
            found[other] = "friend"
    return found


@router.get("")
def list_friends(user: CurrentUser) -> FriendsOut:
    """Friends of the logged in user, and the requests they received and sent"""
    found = relations(user.id)
    groups: dict[Relation, list[PublicUserOut]] = {
        "friend": [],
        "incoming": [],
        "outgoing": [],
    }
    for other in users_db.get_users(found):
        groups[found[other.id]].append(PublicUserOut.model_validate(other))
    return FriendsOut(
        friends=groups["friend"],
        incoming=groups["incoming"],
        outgoing=groups["outgoing"],
    )


@router.get("/search")
def search_users(
    user: CurrentUser, q: Annotated[str, Query(min_length=2, max_length=20)]
) -> list[UserSearchOut]:
    """Other users by username, with what they already are to the logged in user"""
    found = relations(user.id)
    return [
        UserSearchOut(
            id=other.id,
            username=other.username,
            avatar=other.avatar,
            relation=found.get(other.id),
        )
        for other in users_db.search_users(q.strip(), user.id, SEARCH_LIMIT)
    ]


@router.post("/{user_id}")
async def add_friend(user_id: int, user: CurrentUser) -> RelationOut:
    """Send a friend request, or accept theirs if they already asked"""
    if user_id == user.id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You can't add yourself")
    try:
        friends = await run_in_threadpool(friends_db.add, user.id, user_id)
    except IntegrityError:
        # the foreign key: no user with this id
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found") from None
    await manager.send(
        user_id,
        {
            "type": "friend_accepted" if friends else "friend_request",
            "userId": user.id,
            "username": user.username,
        },
    )
    return RelationOut(relation="friend" if friends else "outgoing")


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_friend(user_id: int, user: CurrentUser) -> None:
    """Remove a friend, decline their request or cancel yours"""
    if not await run_in_threadpool(friends_db.remove, user.id, user_id):
        raise HTTPException(
            status.HTTP_404_NOT_FOUND, "No friendship or request with this user"
        )
    await manager.send(user_id, {"type": "friend_removed", "userId": user.id})
