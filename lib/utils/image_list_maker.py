import json

listing_code = "SOK-003"
count = 11

images = [
    {
        "image_url": f"https://plus-estate.s3.us-east-2.amazonaws.com/{listing_code}/{listing_code}-Image-{str(i).zfill(5)}.jpg"
    }
    for i in range(1, count + 1)
]

with open("images.json", "w") as f:
    json.dump(images, f, indent=2)
