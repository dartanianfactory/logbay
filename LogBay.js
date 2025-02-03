/**
 * @author Roman Agafonov
 * @version 1.0
 * @description LogBay - Логер
 */
const fs = require('fs');
const path = require('path');
const dir = path.resolve();

class LogBay {

    constructor() {
        this.save_path = path.join(dir, '/logs/');
        this.log_date = `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
    }

    /**
     * @description Пишет в логи
     * @param {string} str Строка ДАННЫХ для записи и ничего больше!
     */
    w_log = (str = '') => {

        this._check_folder();
        
        const fullPath = path.join(this.save_path, this.log_date, 'log.txt');
        const now = new Date();
        
        // Форматирование времени: HH:MM:SS
        const logTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()} -> \n`;
        
        // Собираем строку с переносом в конце
        const result = `${logTime}\t\t${str}\n`;
        console.log(fullPath);
        try {
            fs.appendFileSync(fullPath, result);
        } catch (e) {
            console.error("ERROR:Ошибка записи в лог!!!:", e);
        }

    };

    /**
     * @description Читает логи
     * @param {int} nRow Номер первой строки
     * @param {int} cow Кол-во строк возврата
     */
    r_log = (nRow = 0, cRows = 10) => {

        this._check_folder();
        
        const fullPath = path.join(this.save_path, this.log_date, "log.txt");
        
        try {

            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split("\n");
            
            if (nRow === -1) return content;
            if (nRow < 0 || nRow >= lines.length) return "";

            return lines
                .slice(nRow, nRow + cRows)
                .join("\n");
                
        } catch (e) {
            console.error("ERROR:Ошибка чтения лога r_log():", e);
            return "";
        }

    }

    /**
     * @description Выборка из логов. Возвращает ВСЕ строки, где было найдено search;
     * @param {string} dateFolder Дата в формате '02/02/2025' соответствующая существующей папке
     * @param {string} search Строка для поиска
     */
    s_log = (dateFolder = '02/02/2025', search = '') => {

        this._check_folder();

        let rString = '';
        
        const fullPath = path.join(this.save_path, this.log_date, "log.txt");
        
        try {

            const content = fs.readFileSync(fullPath, "utf8");
            const lines = content.split("\n");

            for(let line of lines) {
                const rFind = line.toLowerCase().includes(search);
                if(rFind) {
                    rString += line + '\n';
                }
            }
            
            if(rString) {
                return rString;
            } else {
                throw `строка ${search} не найдена в логе ${dateFolder}`;
            }
                
        } catch (e) {
            console.error("ERROR:Ошибка чтения лога s_log():", e);
            return "";
        }

    }

    _check_folder = (checkData = null) => {

        const fullPath = path.join(this.save_path, (!checkData) ? this.log_date : checkData);
        
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
    
        const logFilePath = path.join(fullPath, "log.txt");
        if (!fs.existsSync(logFilePath)) {
            fs.writeFileSync(logFilePath, "");
        }
    };

}

module.exports = {
    LogBay
}