#!/bin/bash

set -e

echo "Creating Python virtual environment..."
python3 -m venv aura

echo "Activating virtual environment..."
source aura/bin/activate

echo "Upgrading pip..."
pip install --upgrade pip

echo "Installing dependencies..."
pip install flask bcrypt mongogettersetter

echo ""
echo "========================================"
echo "Setup completed successfully!"
echo "Virtual environment: aura"
echo ""
echo "To activate it later, run:"
echo "source aura/bin/activate"
echo "========================================"