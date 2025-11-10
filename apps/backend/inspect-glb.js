import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple GLB parser to extract basic info
function inspectGLB(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    
    // GLB format: 12-byte header + chunks
    // Header: magic (4 bytes) + version (4 bytes) + length (4 bytes)
    const magic = buffer.toString('utf8', 0, 4);
    
    if (magic !== 'glTF') {
      console.error('Not a valid GLB file');
      return;
    }
    
    const version = buffer.readUInt32LE(4);
    const length = buffer.readUInt32LE(8);
    
    console.log('=== GLB File Info ===');
    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Magic: ${magic}`);
    console.log(`Version: ${version}`);
    console.log(`Total Length: ${length} bytes`);
    console.log(`File Size: ${buffer.length} bytes`);
    console.log('');
    
    // Parse JSON chunk (first chunk after header)
    let offset = 12;
    const chunkLength = buffer.readUInt32LE(offset);
    const chunkType = buffer.toString('utf8', offset + 4, offset + 8);
    
    if (chunkType === 'JSON') {
      const jsonData = buffer.toString('utf8', offset + 8, offset + 8 + chunkLength);
      const gltf = JSON.parse(jsonData);
      
      console.log('=== GLTF Structure ===');
      console.log(`Version: ${gltf.asset?.version || 'unknown'}`);
      console.log(`Generator: ${gltf.asset?.generator || 'unknown'}`);
      console.log('');
      
      console.log('=== Nodes ===');
      if (gltf.nodes) {
        gltf.nodes.forEach((node, index) => {
          console.log(`  [${index}] ${node.name || 'unnamed'}`);
          if (node.mesh !== undefined) {
            const mesh = gltf.meshes[node.mesh];
            console.log(`      mesh: ${node.mesh} (${mesh?.name || 'unnamed'})`);
          }
          if (node.children) console.log(`      children: ${node.children.length}`);
        });
      } else {
        console.log('  No nodes found');
      }
      console.log('');
      
      console.log('=== Nodes with Meshes (for component matching) ===');
      if (gltf.nodes) {
        const nodesWithMeshes = gltf.nodes
          .map((node, index) => ({ index, node, mesh: node.mesh !== undefined ? gltf.meshes[node.mesh] : null }))
          .filter(item => item.mesh !== null);
        
        nodesWithMeshes.forEach(({ index, node, mesh }) => {
          console.log(`  Node: ${node.name || `[${index}]`} -> Mesh: ${mesh.name || `mesh[${node.mesh}]`}`);
        });
      }
      console.log('');
      
      console.log('=== Meshes ===');
      if (gltf.meshes) {
        gltf.meshes.forEach((mesh, index) => {
          console.log(`  [${index}] ${mesh.name || 'unnamed'}`);
          if (mesh.primitives) {
            mesh.primitives.forEach((prim, pIndex) => {
              console.log(`      Primitive ${pIndex}:`);
              if (prim.attributes) {
                console.log(`        Attributes: ${Object.keys(prim.attributes).join(', ')}`);
              }
              if (prim.targets) {
                console.log(`        Morph Targets: ${prim.targets.length}`);
                if (prim.targets.length > 0) {
                  const firstTarget = prim.targets[0];
                  console.log(`        Morph Target Attributes: ${Object.keys(firstTarget).join(', ')}`);
                }
              }
            });
          }
        });
      } else {
        console.log('  No meshes found');
      }
      console.log('');
      
      console.log('=== Materials ===');
      if (gltf.materials) {
        gltf.materials.forEach((material, index) => {
          console.log(`  [${index}] ${material.name || 'unnamed'}`);
          if (material.pbrMetallicRoughness) {
            console.log(`      Type: PBR Metallic Roughness`);
          }
          if (material.doubleSided !== undefined) {
            console.log(`      Double Sided: ${material.doubleSided}`);
          }
        });
      } else {
        console.log('  No materials found');
      }
      console.log('');
      
      console.log('=== Accessors (for morph targets) ===');
      if (gltf.accessors) {
        const morphTargetAccessors = gltf.accessors.filter((acc, idx) => {
          // Check if this accessor is used in morph targets
          return gltf.meshes?.some(mesh => 
            mesh.primitives?.some(prim => 
              prim.targets?.some(target => 
                Object.values(target).includes(idx)
              )
            )
          );
        });
        
        if (morphTargetAccessors.length > 0) {
          console.log(`  Found ${morphTargetAccessors.length} morph target accessors`);
          // Get unique morph target names from meshes
          const morphTargetNames = new Set();
          gltf.meshes?.forEach(mesh => {
            mesh.primitives?.forEach(prim => {
              prim.targets?.forEach(target => {
                Object.keys(target).forEach(key => morphTargetNames.add(key));
              });
            });
          });
          console.log(`  Morph Target Names: ${Array.from(morphTargetNames).join(', ')}`);
        } else {
          console.log('  No morph targets found');
        }
      }
      console.log('');
      
      console.log('=== Scene Structure ===');
      if (gltf.scenes && gltf.scenes[0]) {
        const scene = gltf.scenes[0];
        console.log(`  Scene: ${scene.name || 'default'}`);
        if (scene.nodes) {
          console.log(`  Root Nodes: ${scene.nodes.join(', ')}`);
        }
      }
      
    } else {
      console.log('Could not find JSON chunk');
    }
    
  } catch (error) {
    console.error('Error reading GLB file:', error.message);
  }
}

// Get file path from command line argument
const filePath = process.argv[2];

if (!filePath) {
  console.log('Usage: node inspect-glb.js <path-to-glb-file>');
  console.log('');
  console.log('Example:');
  console.log('  node inspect-glb.js ../frontend/public/models/avatar.glb');
  process.exit(1);
}

const fullPath = path.isAbsolute(filePath) ? filePath : path.join(__dirname, filePath);
inspectGLB(fullPath);

