/**
 * Downloads already-completed Luma jobs
 */
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const LUMA_API_KEY = 'luma-d2033477-ca16-4c23-a31a-041e26390df5-7c5516d8-fd59-43b4-8926-899fb2b846c0';
const LUMA_API = 'https://api.lumalabs.ai/dream-machine/v1/generations';

const JOBS = [
  { id: 'sedan',       jobId: 'a95ca4ba-174c-407c-b5d7-533a13b4f6f2' },
  { id: 'suv',         jobId: '27737782-28d0-4423-b42e-489416e6c8c0' },
  { id: 'truck',       jobId: '509a7a72-d8dd-48d9-86ad-536cfeb17ce6' },
  { id: 'van',         jobId: '02e32305-4db9-4625-b3b8-5bb570eb2151' },
  { id: 'coupe',       jobId: '7f21c21c-6f53-4663-9a39-417e5fe8b8f1' },
  { id: 'convertible', jobId: '39b1564b-e0ac-4838-9a8b-2bc830fcc128' },
  { id: 'electric',    jobId: '49afe2ed-0add-4fee-bccf-5dcceafc4335' },
  { id: 'other',       jobId: '4f3e771e-fdd8-4b08-879c-c12fc0275be2' },
];

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputDir = path.join(__dirname, '..', 'public', 'videos');

async function pollUntilDone(jobId, vehicleId) {
  for (let i = 0; i < 60; i++) {
    const res = await fetch(`${LUMA_API}/${jobId}`, {
      headers: { 'authorization': `Bearer ${LUMA_API_KEY}` },
    });
    const status = await res.json();
    if (status.state === 'completed') return status.assets?.video;
    if (status.state === 'failed') throw new Error(`${vehicleId} failed: ${status.failure_reason}`);
    process.stdout.write(`  ⏳ ${vehicleId}: ${status.state}...\r`);
    await new Promise(r => setTimeout(r, 5000));
  }
  throw new Error(`Timeout: ${vehicleId}`);
}

async function main() {
  await mkdir(outputDir, { recursive: true });
  const manifest = {};

  for (const job of JOBS) {
    try {
      console.log(`\n🔍 Checking ${job.id} (${job.jobId})...`);
      const videoUrl = await pollUntilDone(job.jobId, job.id);
      console.log(`  ✅ Done! URL: ${videoUrl}`);

      console.log(`  ⬇️  Downloading...`);
      const res = await fetch(videoUrl);
      const buffer = await res.arrayBuffer();
      const filePath = path.join(outputDir, `${job.id}.mp4`);
      await writeFile(filePath, Buffer.from(buffer));
      console.log(`  💾 Saved: public/videos/${job.id}.mp4`);

      manifest[job.id] = `/videos/${job.id}.mp4`;
    } catch (err) {
      console.error(`  ❌ ${job.id}: ${err.message}`);
    }
  }

  await writeFile(
    path.join(__dirname, '..', 'app', 'vehicle-videos.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('\n\n📋 Manifest written to app/vehicle-videos.json');
  console.log(JSON.stringify(manifest, null, 2));
}

main().catch(console.error);
