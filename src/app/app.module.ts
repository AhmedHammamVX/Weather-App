import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { TestComponent } from './test/test.component';
import { NgxAnimatedCounterModule } from '@bugsplat/ngx-animated-counter';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    TestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxAnimatedCounterModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
