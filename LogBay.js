/**
 * @author Roman Agafonov
 * @version 1.12
 * @description LogBay - Простой логгер для проектов)
 */
const fs = require('fs');
const path = require('path');
const dir = path.resolve();

const formatDate = (date) => {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
};

const formatTime = (date) => {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    const s = date.getSeconds().toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
};

class LogBay {
    constructor() {
        this.save_path = path.join(dir, 'logs');
    }

    write_log = (str = '') => {
        if (typeof str !== 'string') throw new Error("Input must be a string");
        
        const logDate = formatDate(new Date());
        this._check_folder(logDate);
        
        const fullPath = path.join(this.save_path, logDate, 'log.txt');
        const now = new Date();
        const result = `${formatTime(now)} -> ${str}\n`;
        
        try {
            fs.appendFileSync(fullPath, result, 'utf8');
        } catch (e) {
            console.error(`ERROR in write_log: ${e.message} (${e.code})`);
        }
    };

    read_log = (dateFolder = formatDate(new Date()), nRow = 0, cRows = 10) => {
        this._check_folder(dateFolder);
        const fullPath = path.join(this.save_path, dateFolder, "log.txt");
        
        try {
            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split("\n");
            
            if (nRow === -1) return content;
            if (nRow < 0 || nRow >= lines.length) return "";
            
            return lines.slice(nRow, nRow + cRows).join("\n");
        } catch (e) {
            console.error(`ERROR in read_log: ${e.message} (${e.code})`);
            return "";
        }
    }

    search_log = (dateFolder = formatDate(new Date()), search = '') => {
        const searchDate = dateFolder.replace(/\//g, '-');
        this._check_folder(searchDate);
        
        const fullPath = path.join(this.save_path, searchDate, "log.txt");
        let rString = '';
        
        try {
            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split("\n");
            const searchLower = search.toLowerCase();
            
            for(let line of lines) {
                if (line.toLowerCase().includes(searchLower)) {
                    rString += line + '\n';
                }
            }
            return rString || `No matches for "${search}" in ${searchDate}`;
        } catch (e) {
            console.error(`ERROR in search_log: ${e.message} (${e.code})`);
            return "";
        }
    }

    console_write_log = (...args) => {
        console.log(...args); 

        const cleanText = args
            .map(arg => {
                if (typeof arg === 'object') {
                    return JSON.stringify(arg, null, 2);
                }
                return String(arg).replace(/\x1B\[\d+m/g, '');
            })
            .join(' ');

        this.write_log(cleanText); 
    };

    _check_folder = (folderName) => {
        const fullPath = path.join(this.save_path, folderName);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        
        const logFilePath = path.join(fullPath, "log.txt");
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, "");
        }
    };
}

module.exports = { LogBay };