from sqlalchemy import Engine, Select
from sqlalchemy.orm import Session

from .connection import Roles, User, engine

# fields that can be read or updated from outside with their accepted types
USER_FIELDS: dict[str, type | tuple[type, ...]] = {
	"name": str,
	"lastname": str,
	"email": str,
	"role": Roles,
	"avatar": (str, type(None)),
}


class SQLRequest:
	engine: Engine

	def __init__(self, engine: Engine) -> None:
		self.engine = engine

	"""get a user from the db.

	retrieve the first User row where the id parovided match with the User.id.

	Args:
		id (int): the user id.

	Returns:.
		User: where a User match.
		None No Usr match.
	"""

	def GetUser(self, id: int) -> User | None:
		with Session(self.engine) as sess:
			stmt: Select = Select(User).where(User.id == id)
			res: User | None = sess.scalar(stmt)
			return res

	"""Get a identifier from the db.

	retrieve the first User.id row where name, lastname, email provided match with the User.(name, lastname, email).

	Args:
		name (str): the user name.
		lastname (str): the user lastname.
		email (str): the user email.
	Returns:
		int | None: the matching id, or None if not found.
	"""

	def getID(self, name: str, lastname: str, email: str) -> int | None:
		with Session(self.engine) as sess:
			stmt: Select = Select(User.id).where(
				User.name == name, User.lastname == lastname, User.email == email
			)
			res: int | None = sess.scalar(stmt)
			return res

	"""add a user

	add a new User with name, lastname, email, role, avatar provided

	Args:
		name (str): the user name
		lastname (str): the user lastname
		email (str): the user email
		role (Roles): the user role
		avatar (str|None): the string path to the avatar, None if no avatar provided. defaults to None.
	"""

	def AddUser(
		self,
		name: str,
		lastname: str,
		email: str,
		role: Roles,
		avatar: str | None = None,
	) -> None:
		with Session(self.engine) as sess:
			sess.add(
				User(
					name=name, lastname=lastname, email=email, role=role, avatar=avatar
				)
			)
			sess.commit()

	"""delete a a User.

	delete the User where the id provided match with User.ID.

	Args:
		id (int): the user id.

	Returns:
		bool: True if an User match, or False no User match.
	"""

	def DelUser(self, id: int) -> bool:
		with Session(self.engine) as sess:
			user: User | None = sess.get(User, id)
			if user is None:
				return False
			sess.delete(user)
			sess.commit()
			return True

	"""Update a single field of an existing user.

	change a single field of an existing user
	where the id match with an User.id and the fieldname
	that exist in User (e.g User.id, User.name),
	fieldvalue is the new value of User.fieldname.
	Args:
		id (int): Primary key of the user to update.
		fieldname (str): Name of the User attribute to set. Must be a
			key of USER_FIELDS.
		fieldvalue (str | Roles | None): New value for the field. Its type
			must match the type listed in USER_FIELDS.

	Returns:
		bool: True if the field was updated and committed, False if the
		user does not exist, the field is invalid/private, or the value
		type mismatches.
	"""
	def UpdateUserField(self, id: int, fieldname: str, fieldvalue: str|Roles|None) -> bool:
		with Session(self.engine) as sess:
			user:User|None = sess.get(User, id)
			if user is None:
				return False
			if fieldname not in USER_FIELDS:
				return False
			# query params arrive as str, so convert role values to the enum
			if USER_FIELDS[fieldname] is Roles and isinstance(fieldvalue, str):
				try:
					fieldvalue = Roles(fieldvalue)
				except ValueError:
					return False
			if not isinstance(fieldvalue, USER_FIELDS[fieldname]):
				return False
			setattr(user, fieldname, fieldvalue)
			sess.commit()
			return True

	def GetUserField(self, id: int, fieldname: str) -> str | Roles | None:
		with Session(self.engine) as sess:
			if fieldname not in USER_FIELDS:
				return None
			user: User | None = sess.get(User, id)
			if user is None:
				return None
			return getattr(user, fieldname)


request: SQLRequest = SQLRequest(engine)
