/**
 * High-performance LRU (Least Recently Used) Cache implementation
 * Optimized for ASCII art generation with TypeScript
 */

export interface CacheNode<T> {
  key: string;
  value: T;
  prev: CacheNode<T> | null;
  next: CacheNode<T> | null;
  timestamp: number;
  accessCount: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number;
  memoryUsage: number;
  oldestEntry: number;
  newestEntry: number;
}

export class LRUCache<T> {
  private cache = new Map<string, CacheNode<T>>();
  private head: CacheNode<T> | null = null;
  private tail: CacheNode<T> | null = null;
  private readonly maxSize: number;
  private hits = 0;
  private misses = 0;

  constructor(maxSize: number = 1000) {
    this.maxSize = maxSize;
  }

  get(key: string): T | null {
    const node = this.cache.get(key);
    
    if (!node) {
      this.misses++;
      return null;
    }

    this.hits++;
    node.accessCount++;
    node.timestamp = Date.now();
    
    // Move to front (most recently used)
    this.moveToFront(node);
    
    return node.value;
  }

  set(key: string, value: T): void {
    const existingNode = this.cache.get(key);
    
    if (existingNode) {
      // Update existing node
      existingNode.value = value;
      existingNode.timestamp = Date.now();
      existingNode.accessCount++;
      this.moveToFront(existingNode);
      return;
    }

    // Create new node
    const newNode: CacheNode<T> = {
      key,
      value,
      prev: null,
      next: null,
      timestamp: Date.now(),
      accessCount: 1
    };

    this.cache.set(key, newNode);
    this.addToFront(newNode);

    // Check if we need to evict
    if (this.cache.size > this.maxSize) {
      this.evictLRU();
    }
  }

  has(key: string): boolean {
    return this.cache.has(key);
  }

  delete(key: string): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);
    return true;
  }

  clear(): void {
    this.cache.clear();
    this.head = null;
    this.tail = null;
    this.hits = 0;
    this.misses = 0;
  }

  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const timestamps = entries.map(node => node.timestamp);
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRate: this.hits + this.misses > 0 ? this.hits / (this.hits + this.misses) : 0,
      memoryUsage: this.estimateMemoryUsage(),
      oldestEntry: timestamps.length > 0 ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length > 0 ? Math.max(...timestamps) : 0
    };
  }

  // Get all keys sorted by access frequency
  getHotKeys(limit: number = 10): Array<{ key: string; accessCount: number }> {
    return Array.from(this.cache.values())
      .sort((a, b) => b.accessCount - a.accessCount)
      .slice(0, limit)
      .map(node => ({ key: node.key, accessCount: node.accessCount }));
  }

  private moveToFront(node: CacheNode<T>): void {
    if (node === this.head) return;
    
    this.removeNode(node);
    this.addToFront(node);
  }

  private addToFront(node: CacheNode<T>): void {
    node.next = this.head;
    node.prev = null;

    if (this.head) {
      this.head.prev = node;
    }

    this.head = node;

    if (!this.tail) {
      this.tail = node;
    }
  }

  private removeNode(node: CacheNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next) {
      node.next.prev = node.prev;
    } else {
      this.tail = node.prev;
    }
  }

  private evictLRU(): void {
    if (!this.tail) return;

    const lru = this.tail;
    this.removeNode(lru);
    this.cache.delete(lru.key);
  }

  private estimateMemoryUsage(): number {
    let totalSize = 0;
    
    for (const [key, node] of this.cache) {
      // Estimate key size (2 bytes per character for UTF-16)
      totalSize += key.length * 2;
      
      // Estimate value size (rough approximation)
      if (typeof node.value === 'string') {
        totalSize += node.value.length * 2;
      } else {
        totalSize += 100; // Rough estimate for objects
      }
      
      // Node overhead
      totalSize += 64; // Approximate object overhead
    }
    
    return totalSize;
  }
}