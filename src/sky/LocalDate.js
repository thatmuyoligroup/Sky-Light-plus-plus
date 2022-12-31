class LocalDate {
    /**
     *@type {Date} js原始日期
     */
    date;

    constructor(date) {
        this.date = date;
    }

    static now() {
        return new LocalDate(new Date());
    }

    /**
     *
     * @param year 年
     * @param month 月(1-12)
     * @param day 日(1-31)
     * @returns {LocalDate}
     */
    static of(year, month, day) {
        return new LocalDate(new Date(year, month - 1, day));
    }

    static ofMillisecond(timestamp) {
        return new LocalDate(new Date(timestamp));
    }

    /**
     *
     * @param date {Date} 日期
     * @returns {LocalDate}
     */
    static ofDate(date) {
        return new LocalDate(date);
    }

    getDate() {
        return this.date;
    }

    /**
     * 获取星期几 (1-7)
     */
    getDayOfWeek() {
        return !this.date.getDay() ? 7 : this.date.getDay();
    }

    /**
     * 获取当月的哪一天 (1-31)
     */
    getDayOfMonth() {
        return this.date.getDate();
    }

    /**
     * 获取月份
     * @return {number}
     */
    getMonth() {
        return this.date.getMonth() + 1
    }
}

export default LocalDate
