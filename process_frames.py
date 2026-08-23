import os
import glob
from rembg import remove
from PIL import Image
import time

input_dir = "app/public/welcome-section-frames"
output_dir = "app/public/welcome-section-frames-transparent"

os.makedirs(output_dir, exist_ok=True)

files = sorted(glob.glob(os.path.join(input_dir, "*.jpg")))
total = len(files)

print(f"Found {total} files to process.")

def process_image(input_path):
    filename = os.path.basename(input_path)
    output_path = os.path.join(output_dir, filename.replace('.jpg', '.png'))
    
    if os.path.exists(output_path):
        return f"Skipped {filename}"
        
    try:
        input_image = Image.open(input_path)
        output_image = remove(input_image)
        output_image.save(output_path, "PNG")
        return f"Processed {filename}"
    except Exception as e:
        return f"Error on {filename}: {e}"

if __name__ == '__main__':
    start_time = time.time()
    for i, file_path in enumerate(files):
        result = process_image(file_path)
        print(f"[{i+1}/{total}] {result}", flush=True)

    end_time = time.time()
    print(f"Done processing all frames in {end_time - start_time:.2f} seconds!")
