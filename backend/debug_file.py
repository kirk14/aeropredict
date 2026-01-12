# Save this as backend/debug_file.py and run: python debug_file.py
try:
    with open('train_FD001.txt', 'r') as f:
        print("--- FILE HEADER PREVIEW (First 3 lines) ---")
        lines = [f.readline() for _ in range(3)]
        for i, line in enumerate(lines):
            print(f"Line {i+1}: {line.strip()}")
            
    print("\n--- DIAGNOSIS ---")
    if "<!DOCTYPE" in lines[0] or "<html" in lines[0]:
        print("❌ CRITICAL ERROR: You downloaded the HTML web page, not the data file.")
        print("👉 SOLUTION: Go back to the dataset source, click 'Raw' or 'Download Zip', and extract the .txt file again.")
    elif len(lines[0].split()) < 20:
        print(f"❌ ERROR: The file only has {len(lines[0].split())} columns. We need 26.")
        print("👉 SOLUTION: Check if you accidentally saved 'readme.txt' or a corrupted version.")
    else:
        print("✅ The file looks correct! The issue is in the loading logic.")
        
except FileNotFoundError:
    print("❌ ERROR: train_FD001.txt was not found in this folder.")