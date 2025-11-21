# Bash Scripting Quick Reference

## 1. Creating a Script

1. **Create a file:** `touch myscript.sh`

2. **Add the Shebang:** The first line must define the interpreter.

   ```
   #!/bin/bash
   ```

3. **Make it executable:**

   ```
   chmod +x myscript.sh
   ```

4. **Run it:**

   ```
   ./myscript.sh
   ```

## 2. Variables

No spaces around the `=` sign.

```
NAME="World"
echo "Hello, $NAME!"
```

### Special Variables

- `$1`, `$2`, ... : Command line arguments.
- `$0` : The name of the script itself.
- `$#` : Number of arguments provided.
- `$?` : Exit status of the last executed command (0 = success).

## 3. User Input

Use `read` to accept input during execution.

```
echo "Enter your name:"
read user_name
echo "Welcome, $user_name"
```

## 4. Conditionals (If/Else)

Use `[[ ]]` for flexible testing. Note the spaces inside the brackets.

```
if [[ $1 -gt 10 ]]; then
    echo "Number is greater than 10"
elif [[ $1 -eq 10 ]]; then
    echo "Number is exactly 10"
else
    echo "Number is less than 10"
fi
```

### Common Comparisons

- `-eq`, `-ne`, `-lt`, `-gt` : Integers (Equal, Not Equal, Less Than, Greater Than).
- `==`, `!=` : Strings.
- `-f` : File exists.
- `-d` : Directory exists.
- `-z` : String is empty.

## 5. Loops

### For Loop

Iterate over a list or sequence.

```
# Loop through files
for file in *.txt; do
    echo "Found text file: $file"
done

# Range (1 to 5)
for i in {1..5}; do
    echo "Count: $i"
done
```

### While Loop

Run while a condition is true.

```
count=1
while [[ $count -le 5 ]]; do
    echo "Count: $count"
    ((count++))
done
```

## 6. Functions

Keep code organized.

```
greet() {
    local name=$1 # Use 'local' to scope variables to the function
    echo "Hello from function, $name"
}

greet "Alice"
```

## 7. Practical Examples

### Example A: Automated Backup

Checks if a directory exists, then creates a timestamped archive.

```
#!/bin/bash

SOURCE_DIR="projects"
BACKUP_DIR="backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)

# Check if source exists
if [[ ! -d "$SOURCE_DIR" ]]; then
    echo "Error: Source directory $SOURCE_DIR not found."
    exit 1
fi

mkdir -p "$BACKUP_DIR"

tar -czf "$BACKUP_DIR/backup_$DATE.tar.gz" "$SOURCE_DIR"
echo "Backup completed: backup_$DATE.tar.gz"
```

### Example B: System Health Check

Quickly checks disk usage and warns if it's high.

```
#!/bin/bash

USAGE=$(df / | grep / | awk '{ print $5 }' | sed 's/%//g')
THRESHOLD=90

if [[ "$USAGE" -gt "$THRESHOLD" ]]; then
    echo "WARNING: Disk space is critical! Used: $USAGE%"
else
    echo "Disk space is normal. Used: $USAGE%"
fi
```

### Example C: Batch Rename

Renames all `.htm` files to `.html`.

```
#!/bin/bash

for file in *.htm; do
    # Check if file exists to avoid errors if no matches found
    [ -e "$file" ] || continue
    
    mv "$file" "${file%.htm}.html"
    echo "Renamed $file to ${file%.htm}.html"
done
```