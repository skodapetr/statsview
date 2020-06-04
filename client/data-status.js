export const STATUS_NONE = -1;

export const STATUS_OK = 0;

export const STATUS_WARNING = 1;

export const STATUS_INVALID = 2;


export function worstStatus(statuses){
    return Math.max(...statuses);
}

export function bestStatus(statuses){
    return Math.min(statuses);
}

export function selectIcon(status){
    switch(status) {
        case STATUS_WARNING:
            return "question-circle";
        case STATUS_INVALID:
            return "times-circle";
        case STATUS_NONE:
            return "";
        case STATUS_OK:
        default:
            return "check-circle";
    }
}

export function selectVariant(status) {
    switch(status) {
        case STATUS_WARNING:
            return "warning";
        case STATUS_INVALID:
            return "danger";
        case STATUS_OK:
        default:
            return "info";
    }
}

export function selectColor(status){
    let result;
    switch(status) {
        case STATUS_WARNING:
            result = "Yellow";
            break;
        case STATUS_INVALID:
            result = "Red";
            break;
        case STATUS_NONE:
            result = "White";
            break;
        case STATUS_OK:
        default:
            result = "LimeGreen";
            break;
    }
    return result;
}