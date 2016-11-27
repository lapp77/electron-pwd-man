import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";

import {AppComponent} from "./app.component";
import {SiteEntryFormComponent} from "./site-entry-form.component";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [AppComponent, SiteEntryFormComponent],
    bootstrap: [AppComponent]
})
export class AppModule {
}