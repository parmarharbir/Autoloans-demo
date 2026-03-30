/**
 * Patricia's Luma Video Generator
 * Generates cinematic driving loops for all 8 vehicle types
 * Uses Luma ray-2 API — ~$1.75 per 5s 720p clip
 */

const LUMA_API_KEY = 'luma-d2033477-ca16-4c23-a31a-041e26390df5-7c5516d8-fd59-43b4-8926-899fb2b846c0';
const LUMA_API = 'https://api.lumalabs.ai/dream-machine/v1/generations';

const VEHICLE_PROMPTS = [
  {
    id: 'sedan',
    prompt: 'A sleek silver sedan driving smoothly along a sun-drenched coastal highway, ocean to the right, golden hour light, cinematic wide shot, light and airy atmosphere, photorealistic, 4K quality, continuous motion, no text',
  },
  {
    id: 'suv',
    prompt: 'A black SUV driving through a dramatic golden mountain pass, warm sunlight breaking through peaks, cinematic wide shot, light airy atmosphere, photorealistic, continuous motion, no text',
  },
  {
    id: 'truck',
    prompt: 'A red pickup truck cruising down an open prairie road, vast golden sky, late afternoon sun, cinematic wide shot, light and airy, photorealistic, continuous motion, no text',
  },
  {
    id: 'van',
    prompt: 'A white family van driving along a sunny tree-lined suburban road, warm afternoon light, green trees, blue sky, cinematic, photorealistic, continuous motion, no text',
  },
  {
    id: 'coupe',
    prompt: 'A sports coupe driving along a winding coastal cliffside road, ocean views, golden hour, cinematic wide shot, dramatic light, photorealistic, continuous motion, no text',
  },
  {
    id: 'convertible',
    prompt: 'A red convertible with the top down driving on a sun-drenched beach highway, palm trees, warm golden light, cinematic wide shot, airy and bright, photorealistic, continuous motion, no text',
  },
  {
    id: 'electric',
    prompt: 'A white electric car driving through a clean modern city boulevard at golden hour, glass buildings, soft ambient glow, futuristic yet warm, cinematic wide shot, photorealistic, continuous motion, no text',
  },
  {
    id: 'other',
    prompt: 'A car driving on a beautiful open sunlit road, golden hour, light and airy countryside, cinematic wide shot, photorealistic, continuous forward motion, no text',
  },
];

async function generateVideo(vehicle) {
  console.log(`\n🎬 Generating: ${vehicle.id}...`);

  const res = await fetch(LUMA_API, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${LUMA_API_KEY}`,
      'content-type': 'application/json',
      'accept': 'application/json',
    },
    body: JSON.stringify({
      prompt: vehicle.prompt,
      model: 'ray-2',
      resolution: '720p',
      duration: '5s',
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Luma API error for ${vehicle.id}: ${res.status} ${err}`);
  }

  const job = await res.json();
  console.log(`  ✅ Job submitted: ${job.id}`);
  return { ...vehicle, jobId: job.id };
}

async function pollJob(jobId, vehicleId) {
  const maxAttempts = 60; // 5 min timeout
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 5000)); // poll every 5s

    const res = await fetch(`${LUMA_API}/${jobId}`, {
      headers: { 'authorization': `Bearer ${LUMA_API_KEY}` },
    });

    const status = await res.json();

    if (status.state === 'completed') {
      const videoUrl = status.assets?.video;
      console.log(`  🎉 ${vehicleId} done! URL: ${videoUrl}`);
      return videoUrl;
    }

    if (status.state === 'failed') {
      throw new Error(`Job ${jobId} failed: ${status.failure_reason}`);
    }

    const elapsed = ((i + 1) * 5);
    process.stdout.write(`  ⏳ ${vehicleId}: ${status.state} (${elapsed}s)...\r`);
  }

  throw new Error(`Timeout waiting for ${vehicleId}`);
}

async function downloadVideo(url, vehicleId) {
  const { writeFile, mkdir } = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const outputDir = path.join(__dirname, '..', 'public', 'videos');

  await mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${vehicleId}.mp4`);
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  await writeFile(outputPath, Buffer.from(buffer));

  console.log(`  💾 Saved: public/videos/${vehicleId}.mp4`);
  return outputPath;
}

async function main() {
  console.log('🚗 Patricia\'s Luma Video Generator');
  console.log('====================================');
  console.log(`Generating ${VEHICLE_PROMPTS.length} cinematic driving loops...\n`);

  // Submit all jobs in parallel
  const jobs = [];
  for (const vehicle of VEHICLE_PROMPTS) {
    try {
      const job = await generateVideo(vehicle);
      jobs.push(job);
      await new Promise(r => setTimeout(r, 500)); // small delay between submissions
    } catch (err) {
      console.error(`❌ Failed to submit ${vehicle.id}: ${err.message}`);
    }
  }

  console.log(`\n⏳ Polling ${jobs.length} jobs for completion...\n`);

  // Poll all jobs in parallel
  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      const videoUrl = await pollJob(job.jobId, job.id);
      await downloadVideo(videoUrl, job.id);
      return { id: job.id, url: videoUrl };
    })
  );

  console.log('\n\n📋 Results:');
  console.log('===========');

  const manifest = {};
  for (const result of results) {
    if (result.status === 'fulfilled') {
      console.log(`✅ ${result.value.id}: ${result.value.url}`);
      manifest[result.value.id] = `/videos/${result.value.id}.mp4`;
    } else {
      console.error(`❌ Failed: ${result.reason.message}`);
    }
  }

  // Write manifest file for the Next.js app to import
  const { writeFile } = await import('fs/promises');
  const path = await import('path');
  const { fileURLToPath } = await import('url');
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  await writeFile(
    path.join(__dirname, '..', 'app', 'vehicle-videos.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n✅ Manifest written to app/vehicle-videos.json');
  console.log('\nDone! Now commit public/videos/ and app/vehicle-videos.json, then redeploy.');
}

main().catch(console.error);
