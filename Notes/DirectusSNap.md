Here is the workflow to sync your database structure from **Local** to **Production**.



### Step 1: Create Snapshot (On Local Computer)



Run this command to take a "picture" of your current local database structure and save it to a file.

Bash

```
docker compose exec directus npx directus schema snapshot /directus/extensions/snapshot.yaml
```



### Step 2: Push to GitHub (On Local Computer)



Send that new file to your repository.

Bash

```
# Navigate to your project root if needed
git add backend/extensions/snapshot.yaml  # (Adjust path if your git root is different)
git commit -m "Update Directus schema"
git push origin main
```



### Step 3: Pull & Apply (On Production Server)



Log into your VPS and run these commands to download the file and update the database.

Bash

```
# 1. Get the new file
git pull origin main

# 2. Apply the changes to the live database
docker compose exec directus npx directus schema apply /directus/extensions/snapshot.yaml
```

*(Type `y` when it asks for confirmation).*

------

**Reminder:** This updates **Tables and Columns** only.

- **Permissions/Roles/Users:** Will **NOT** change. (You have to update those manually or dump/restore them via SQL).
- **Content (Rows):** Will **NOT** be touched. Your wife's road trip data is safe.
