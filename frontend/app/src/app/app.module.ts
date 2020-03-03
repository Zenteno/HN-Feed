import {
	BrowserModule
} from '@angular/platform-browser';
import {
	BrowserAnimationsModule
} from '@angular/platform-browser/animations';
import {
	NgModule
} from '@angular/core';
import {
	AppRoutingModule
} from './app-routing.module';
import {
	AppComponent
} from './app.component';

import {
	MatButtonModule
} from '@angular/material/button';
import {
	MatToolbarModule
} from '@angular/material/toolbar';
import {
	MatTableModule
} from '@angular/material/table';
import {
	MatIconModule
} from '@angular/material/icon';
import {
	MatDialogModule
} from '@angular/material/dialog';

import {
	ConfirmDialogComponent
} from './components/confirm-dialog/confirm-dialog.component';
import {
	ArticleListComponent
} from './components/article-list/article-list.component';

import {
	ReactiveFormsModule
} from '@angular/forms';
import {
	HttpClientModule
} from '@angular/common/http';

import {
	ApiService
} from './service/api.service';
import {
	DateAgoPipe
} from './pipes/date-ago.pipe';

@NgModule({
	declarations: [
		AppComponent,
		ArticleListComponent,
		DateAgoPipe,
		ConfirmDialogComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MatTableModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatDialogModule,
	],
	exports: [ConfirmDialogComponent],
	bootstrap: [AppComponent],
	providers: [ApiService],
})

export class AppModule {}