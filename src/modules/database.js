const fs = require('fs');
const path = require('path');

class Database {
    constructor(fileName) {
        this.filePath = path.join(__dirname, `../../data/${fileName}.json`);
        this.data = this.load();
    }

    load() {
        try {
            if (!fs.existsSync(this.filePath)) {
                const dir = path.dirname(this.filePath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                this.save({});
                return {};
            }
            const data = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error(`Error loading ${this.filePath}:`, error);
            return {};
        }
    }

    save(data = this.data) {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
            this.data = data;
            return true;
        } catch (error) {
            console.error(`Error saving ${this.filePath}:`, error);
            return false;
        }
    }

    get(key) {
        return this.data[key];
    }

    set(key, value) {
        this.data[key] = value;
        return this.save();
    }

    delete(key) {
        delete this.data[key];
        return this.save();
    }

    has(key) {
        return key in this.data;
    }

    all() {
        return this.data;
    }

    filter(callback) {
        return Object.entries(this.data).filter(([key, value]) => callback(value, key));
    }

    find(callback) {
        const result = Object.entries(this.data).find(([key, value]) => callback(value, key));
        return result ? result[1] : null;
    }

    clear() {
        this.data = {};
        return this.save();
    }

    push(key, value) {
        if (!Array.isArray(this.data[key])) {
            this.data[key] = [];
        }
        this.data[key].push(value);
        return this.save();
    }
}

module.exports = Database;