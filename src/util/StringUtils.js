export default class StringUtils {
    /**
     *
     * @param template {String} 模板
     * @param obj {Object} kv键值对；
     */
    static format(template, obj) {
        let result = template;

        if (obj) {
            let strings = Object.keys(obj);
            strings.forEach(key => {
                result = result.replaceAll('${' + key + '}', obj[key])
            })
        }

        return result;
    }
}
