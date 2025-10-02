import { BskyAgent } from '@atproto/api'
import 'dotenv/config'
import fs from 'fs'

const agent = new BskyAgent({
  service: 'https://bsky.social'
});

async function postImage() {
  try {
    const response = await agent.login({
      identifier: process.env.BSKY_USERNAME!,
      password: process.env.BSKY_PASSWORD!
    });

    if (response.success) {
      console.log('✅ Logged in successfully');
    }

    // Read image from disk
    const imagePath = './image/p_loveland_piece.jpg'
    const imageBuffer = fs.readFileSync(imagePath)

    // Upload blob
    const upload = await agent.uploadBlob(imageBuffer, {
      encoding: 'image/jpeg'
    });

    // Post with image
    const postResponse = await agent.post({
      text: 'Hello world! I posted this via the api!',
      createdAt: new Date().toISOString(),
      embed: {
        $type: 'app.bsky.embed.images',
        images: [
          {
            image: upload.data.blob,
            alt: 'Loveland piece artwork'
          }
        ]
      }
    });

    console.log('✅ Post created:', postResponse.uri);
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

// Run immediately once
postImage();

// Then repeat every 24 hours
setInterval(postImage, 60 * 60 * 24 * 1000);

