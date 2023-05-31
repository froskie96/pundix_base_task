# pundix_base_task

# Get Started
The csv file can be found in the data folder

To run the script once run
``` bash
yarn ts-node scripts/get_token_supply.ts
```

To run it for a 1 minute saving data every 5s run
``` bash
bash scripts/get_token_supply_1_minute.sh
```

To get the first 20 validators
``` bash
curl -X POST https://fx-json.functionx.io/ -d "{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"validators\",\"params\":{\"height\":\"1\", \"page\":\"1\", \"per_page\":\"20\"}}"
```
