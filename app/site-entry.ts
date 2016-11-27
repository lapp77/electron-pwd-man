export class SiteEntry {
    id: string;
    name: string;
    url: string;
    username: string;
    password: string;

    constructor(name = '', url = '', username = '', password = '') {
        this.name = name;
        this.url = url;
        this.username = username;
        this.password = password;
    }
}
