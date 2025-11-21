#!/bin/bash


while true
do
    clear
    echo "╔══════════════════════════════════════════════════════════════════════════════╗"
    echo "║    Wade Dev: Docker Menu                                                     ║"
    echo "╚══════════════════════════════════════════════════════════════════════════════╝"
    echo ""
    echo "Current Working Directory: $(pwd)"
    echo ""
   echo "Please Select an Option"
    echo
    echo "1) Build and Start Containers"
    echo "2) Stop Containers"
    echo "3) Restart Containers"
    echo "q) Return to Main Menu"
    echo ""

    read -p "Enter your choice ...:  " CHOICE

    case "$CHOICE" in
        1) 
            echo "Building and starting all containers in detached mode..."
            docker compose up -d --build
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        2)
            echo "Stopping and removing all containers..."
            docker compose down
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        3)
            echo "Restarting all containers..."
            docker compose restart
            echo "Done."
            read -p "Press [Enter] to continue..."
            ;;
        q)
            echo "Returning to Main Menu"
            break
            ;;
        *)
            echo "Invalid Choice"
            read -p "Press [Enter] to continue..."
            ;;
    esac
done
