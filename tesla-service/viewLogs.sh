e-tracker-server/viewLogs.sh
#!/bin/bash
docker-compose logs -f --tail="50"