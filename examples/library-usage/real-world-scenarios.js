/**
 * Real-World Usage Scenarios
 * Demonstrates practical applications and use cases
 */

import { 
  render, 
  renderFilled, 
  getPerformanceStats,
  preloadCommonPatterns 
} from 'oh-my-logo';

console.log('🌍 Real-World Usage Scenarios\n');

// Scenario 1: CLI Application Startup Banner
console.log('1. CLI Application Startup Banner:');

class CLIApp {
  constructor(name, version) {
    this.name = name;
    this.version = version;
  }
  
  async showBanner() {
    console.log('Starting application...\n');
    
    // Show app name with gradient
    const banner = await render(this.name, { 
      palette: 'gold',
      direction: 'horizontal'
    });
    console.log(banner);
    
    // Show version info
    console.log(`Version: ${this.version}`);
    console.log(`Ready to serve! 🚀\n`);
  }
}

const myApp = new CLIApp('MYAPP', '1.0.0');
await myApp.showBanner();

console.log('='.repeat(50) + '\n');

// Scenario 2: Build System Success/Error Messages
console.log('2. Build System Messages:');

class BuildSystem {
  async showSuccess(projectName) {
    console.log('✅ Build completed successfully!\n');
    
    const successBanner = await render('SUCCESS', { 
      palette: 'forest',
      direction: 'vertical'
    });
    console.log(successBanner);
    
    console.log(`Project: ${projectName}`);
    console.log(`Build time: ${Date.now() % 10000}ms\n`);
  }
  
  async showError(errorType) {
    console.log('❌ Build failed!\n');
    
    const errorBanner = await render('ERROR', { 
      palette: 'fire',
      direction: 'diagonal'
    });
    console.log(errorBanner);
    
    console.log(`Error: ${errorType}\n`);
  }
}

const buildSystem = new BuildSystem();
await buildSystem.showSuccess('my-awesome-project');
await buildSystem.showError('TypeScript compilation failed');

console.log('='.repeat(50) + '\n');

// Scenario 3: Development Server Status
console.log('3. Development Server Status:');

class DevServer {
  constructor() {
    this.isRunning = false;
    this.port = 3000;
  }
  
  async start() {
    console.log('Starting development server...\n');
    
    const serverBanner = await render('DEV\\nSERVER', { 
      palette: 'matrix',
      direction: 'vertical'
    });
    console.log(serverBanner);
    
    this.isRunning = true;
    console.log(`🌐 Server running on http://localhost:${this.port}`);
    console.log('📁 Serving files from ./dist');
    console.log('🔄 Watching for changes...\n');
  }
  
  async showHotReload(filename) {
    console.log(`🔥 Hot reload: ${filename} changed`);
    
    const reloadBanner = await render('RELOAD', { 
      palette: 'fire',
      font: 'Standard'
    });
    console.log(reloadBanner);
    console.log('✨ Changes applied!\n');
  }
}

const devServer = new DevServer();
await devServer.start();
await devServer.showHotReload('src/App.tsx');

console.log('='.repeat(50) + '\n');

// Scenario 4: Deployment Pipeline
console.log('4. Deployment Pipeline:');

class DeploymentPipeline {
  async deploy(environment, version) {
    console.log(`🚀 Deploying to ${environment}...\n`);
    
    // Show deployment banner
    const deployBanner = await render('DEPLOY', { 
      palette: environment === 'production' ? 'gold' : 'ocean',
      direction: 'horizontal'
    });
    console.log(deployBanner);
    
    // Simulate deployment steps
    const steps = [
      'Building application...',
      'Running tests...',
      'Uploading assets...',
      'Updating configuration...',
      'Starting services...'
    ];
    
    for (const step of steps) {
      console.log(`⏳ ${step}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate work
      console.log(`✅ ${step.replace('...', ' completed')}`);
    }
    
    // Success message
    const successBanner = await render('LIVE', { 
      palette: 'forest',
      direction: 'diagonal'
    });
    console.log('\n' + successBanner);
    console.log(`🎉 Deployment successful!`);
    console.log(`Environment: ${environment}`);
    console.log(`Version: ${version}`);
    console.log(`URL: https://${environment}.myapp.com\n`);
  }
}

const pipeline = new DeploymentPipeline();
await pipeline.deploy('staging', 'v1.2.3');

console.log('='.repeat(50) + '\n');

// Scenario 5: API Service Status Dashboard
console.log('5. API Service Status Dashboard:');

class ServiceDashboard {
  constructor() {
    this.services = [
      { name: 'AUTH', status: 'healthy', palette: 'forest' },
      { name: 'API', status: 'healthy', palette: 'ocean' },
      { name: 'DB', status: 'warning', palette: 'gold' },
      { name: 'CACHE', status: 'error', palette: 'fire' }
    ];
  }
  
  async showStatus() {
    console.log('📊 Service Status Dashboard\n');
    
    // Show main title
    const titleBanner = await render('STATUS', { 
      palette: 'purple',
      direction: 'horizontal'
    });
    console.log(titleBanner);
    
    // Show each service status
    for (const service of this.services) {
      const statusIcon = {
        'healthy': '✅',
        'warning': '⚠️',
        'error': '❌'
      }[service.status];
      
      console.log(`\n${statusIcon} ${service.name} Service:`);
      
      const serviceBanner = await render(service.name, { 
        palette: service.palette,
        font: 'Standard'
      });
      console.log(serviceBanner);
      
      console.log(`Status: ${service.status.toUpperCase()}`);
    }
    
    console.log('\n📈 Overall system health: 75%\n');
  }
}

const dashboard = new ServiceDashboard();
await dashboard.showStatus();

console.log('='.repeat(50) + '\n');

// Scenario 6: Performance-Optimized Logo Generator Service
console.log('6. High-Performance Logo Service:');

class LogoService {
  constructor() {
    this.requestCount = 0;
    this.preloadCompleted = false;
  }
  
  async initialize() {
    console.log('🔧 Initializing logo service...\n');
    
    // Preload common patterns for better performance
    if (!this.preloadCompleted) {
      console.log('⚡ Preloading common patterns...');
      await preloadCommonPatterns();
      this.preloadCompleted = true;
      console.log('✅ Preload completed\n');
    }
    
    const serviceBanner = await render('LOGO\\nSERVICE', { 
      palette: 'nebula',
      direction: 'vertical'
    });
    console.log(serviceBanner);
    console.log('🎨 Logo generation service ready!\n');
  }
  
  async generateLogo(text, options = {}) {
    this.requestCount++;
    const startTime = performance.now();
    
    console.log(`📝 Request #${this.requestCount}: Generating "${text}"`);
    
    const logo = await render(text, {
      palette: options.palette || 'sunset',
      direction: options.direction || 'horizontal',
      font: options.font || 'Standard'
    });
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    console.log(`⚡ Generated in ${renderTime.toFixed(2)}ms`);
    
    // Show performance stats every 5 requests
    if (this.requestCount % 5 === 0) {
      const stats = getPerformanceStats();
      console.log(`📊 Cache hit rate: ${(stats.totalHitRate * 100).toFixed(1)}%`);
      console.log(`💾 Memory usage: ${stats.memoryUsageMB.toFixed(2)}MB`);
    }
    
    return logo;
  }
}

const logoService = new LogoService();
await logoService.initialize();

// Simulate multiple requests
const requests = [
  { text: 'HELLO', options: { palette: 'sunset' } },
  { text: 'WORLD', options: { palette: 'ocean' } },
  { text: 'HELLO', options: { palette: 'sunset' } }, // Duplicate for cache hit
  { text: 'API', options: { palette: 'matrix' } },
  { text: 'FAST', options: { palette: 'fire' } }
];

for (const request of requests) {
  await logoService.generateLogo(request.text, request.options);
  console.log(); // Add spacing
}

console.log('✅ All real-world scenarios completed!');
console.log('\n🎯 Key Benefits Demonstrated:');
console.log('• Fast startup with preloading');
console.log('• Intelligent caching for repeated requests');
console.log('• Memory-efficient batch processing');
console.log('• Real-time performance monitoring');
console.log('• Production-ready error handling');