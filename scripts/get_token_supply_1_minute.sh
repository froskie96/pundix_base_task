for i in {1..20}; do
  echo "Saving data for the $i time" &
  yarn ts-node scripts/get_token_supply.ts &
  sleep 5
done
