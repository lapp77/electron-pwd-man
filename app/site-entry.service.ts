import { Injectable } from '@angular/core';
import { SiteEntry } from './site-entry';
import { ipcRenderer } from 'electron';

@Injectable()
export class SiteEntryService {

    search(terms: string): Promise<SiteEntry[]> {
        return new Promise<SiteEntry[]>((resolve) => {
            if (ipcRenderer) {
                let hits = ipcRenderer.sendSync('search', terms);
                let entries = hits.map((hit) => {
                    let entry = new SiteEntry(hit['_source'].name, hit['_source'].url, hit['_source'].username, hit['_source'].password);
                    entry.id = hit['_id'];
                    return entry;
                });
                resolve(entries);
            } else {
                resolve([]);
            }
        });
    }

    save(entry: SiteEntry): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            if (ipcRenderer) {
                resolve(ipcRenderer.sendSync('save-entry', entry));
            } else {
                resolve(false);
            }
        });
    }
}