import { Component } from '@angular/core';
import { SiteEntry } from './site-entry';
import { SiteEntryService } from './site-entry.service';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'main.template.html',
    providers: [SiteEntryService]
})
export class AppComponent {
    searchTerm: string;
    message: string;
    entries: SiteEntry[] = [];
    entryToEdit: SiteEntry;

    constructor(private siteEntryService: SiteEntryService) {
        this.entryToEdit = new SiteEntry();
    }

    onSearch(): void {
        this.siteEntryService.search(this.searchTerm).then((entries) => { this.entries = entries; });
    }

    onSelect(entry: SiteEntry): void {
        this.message = null;
        this.entryToEdit = entry;
    }

    onNew(): void {
        this.message = null;
        this.entryToEdit = new SiteEntry();
    }

    onSaved(entry: SiteEntry): void {
        this.message = null;
        this.siteEntryService.save(entry).then((saved) => this.message = saved ? 'Save successful!' : 'Not saved!');
    }
}