import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SiteEntry } from './site-entry';

@Component({
    moduleId: module.id,
    selector: 'site-entry-form',
    templateUrl: 'site-entry-form.template.html'
})
export class SiteEntryFormComponent { 
    _entry: SiteEntry;

    @Output() onSaved = new EventEmitter<SiteEntry>();

    get entry() {
        return this._entry;
    }

    @Input()
    set entry(entry: SiteEntry) {
        this._entry = Object.assign({}, entry);
    }

    save(): void {
        this.onSaved.emit(this._entry);
    }
}