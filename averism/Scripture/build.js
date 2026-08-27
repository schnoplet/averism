const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const VAULT_DIR = __dirname;
const OUTPUT_DIR = path.join(__dirname, 'docs');

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function parseNumberedName(name) {
  const match = name.match(/^(\d+)\s*[-–—]\s*(.+)$/);
  if (match) {
    return { order: parseInt(match[1]), title: match[2].trim() };
  }
  return { order: 999, title: name.replace(/\.md$/, '') };
}

function scanVault(dir, basePath = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const result = { folders: [], files: [] };

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      const folderData = scanVault(fullPath, relativePath);
      const parsed = parseNumberedName(entry.name);
      result.folders.push({
        name: entry.name,
        title: parsed.title,
        order: parsed.order,
        path: relativePath,
        ...folderData
      });
    } else if (entry.name.endsWith('.md')) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      const { data, content: markdownContent } = matter(content);
      const parsed = parseNumberedName(entry.name);
      result.files.push({
        name: entry.name,
        title: data.title || parsed.title,
        order: parsed.order,
        path: relativePath,
        slug: slugify(relativePath.replace(/\.md$/, '')),
        content: markdownContent,
        frontmatter: data
      });
    }
  }

  result.folders.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  result.files.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  return result;
}

function generateManifest() {
  const vault = scanVault(VAULT_DIR);
  const allPages = [];

  function collectPages(node, parentPath = '') {
    for (const file of node.files) {
      allPages.push({
        ...file,
        parentPath
      });
    }
    for (const folder of node.folders) {
      collectPages(folder, path.join(parentPath, folder.name));
    }
  }

  collectPages(vault);

  const manifest = {
    generated: new Date().toISOString(),
    structure: vault,
    pages: allPages.reduce((acc, page) => {
      acc[page.slug] = {
        title: page.title,
        content: page.content,
        frontmatter: page.frontmatter,
        folder: path.dirname(page.path).split(path.sep).filter(Boolean)
      };
      return acc;
    }, {}),
    navigation: allPages.map(p => ({
      slug: p.slug,
      title: p.title,
      folder: path.dirname(p.path).split(path.sep).filter(Boolean)
    }))
  };

  return manifest;
}

function build() {
  console.log('Scanning vault...');
  const manifest = generateManifest();

  console.log(`Found ${manifest.navigation.length} pages in ${Object.keys(manifest.structure.folders).length} folders`);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log('Manifest written to docs/manifest.json');
  console.log('Build complete!');
}

build();