from fastapi import APIRouter, Depends, HTTPException, Response, status
from httpx import AsyncClient, HTTPError
from schemas import WorkspaceMetrics
from security import AdminUser, require_admin

router = APIRouter(
    prefix="/prometheus", tags=["monitoring"], dependencies=[Depends(require_admin)]
)

PROMETHEUS_URL = "http://prometheus:9090"


async def prom_query(query: str) -> float:
    """Execute Prometheus query and return the numeric value."""
    async with AsyncClient() as client:
        try:
            response = await client.get(
                f"{PROMETHEUS_URL}/api/v1/query", params={"query": query}
            )
            response.raise_for_status()
        except HTTPError:
            raise HTTPException(
                status.HTTP_502_BAD_GATEWAY, "Prometheus unreachable"
            ) from None

        result = response.json()["data"]["result"]
        if not result:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "No metrics data found")
        return float(result[0]["value"][1])


@router.get("/grafana-auth", status_code=status.HTTP_204_NO_CONTENT)
def grafana_auth(user: AdminUser, response: Response) -> None:
    """nginx auth_request for /grafana/"""
    # grafana (auth proxy) logs in the account with this email
    response.headers["X-WEBAUTH-USER"] = user.email


@router.get("/workspace/{user_id}", response_model=WorkspaceMetrics)
async def get_workspace_metrics(user_id: int):
    try:
        # CPU: rate over 1 minute * 100 = percentage
        cpu = await prom_query(
            f'rate(container_cpu_usage_seconds_total{{container_label_silk_space_user_id="{user_id}"}}[1m]) * 100'
        )

        # Memory: usage / limit * 100
        mem_used = await prom_query(
            f'container_memory_usage_bytes{{container_label_silk_space_user_id="{user_id}"}}'
        )
        mem_limit = await prom_query(
            f'container_spec_memory_limit_bytes{{container_label_silk_space_user_id="{user_id}"}}'
        )
        memory_percent = (mem_used / mem_limit) * 100
        memory_used_mb = mem_used / (1024 * 1024)
        memory_total_mb = mem_limit / (1024 * 1024)

        # Network: bytes/sec -> kbps (*8 bits / 1024)
        network_rx = await prom_query(
            f'rate(container_network_receive_bytes_total{{container_label_silk_space_user_id="{user_id}"}}[1m]) * 8 / 1024'
        )
        network_tx = await prom_query(
            f'rate(container_network_transmit_bytes_total{{container_label_silk_space_user_id="{user_id}"}}[1m]) * 8 / 1024'
        )

        # Uptime: current time - start time
        uptime = await prom_query(
            f'time() - container_start_time_seconds{{container_label_silk_space_user_id="{user_id}"}}'
        )

        return WorkspaceMetrics(
            user_id=user_id,
            cpu_usage_percent=round(cpu, 2),
            memory_usage_percent=round(memory_percent, 2),
            memory_used_mb=round(memory_used_mb, 2),
            memory_total_mb=round(memory_total_mb, 2),
            network_rx_kbps=round(network_rx, 2),
            network_tx_kbps=round(network_tx, 2),
            uptime_seconds=round(uptime, 2),
        )
    except ZeroDivisionError:
        raise HTTPException(
            status_code=500, detail="Invalid memory limit (division by zero)"
        )
