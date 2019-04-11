import { Injectable } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {environment} from "../environments/environment";
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilterServiceService {
  filtersPerProcess : any;
  thisProcess : string;
  webservicePath: string;

  constructor(private http: HttpClient) {
    this.webservicePath = environment.webServicePath;
    this.filtersPerProcess = localStorage.getItem("filtersPerProcess");
    if (this.filtersPerProcess == null) {
      this.filtersPerProcess = new Object();
    }
    else {
      this.filtersPerProcess = JSON.parse(this.filtersPerProcess);
    }
    this.thisProcess = localStorage.getItem("process");
    if (!(this.thisProcess in this.filtersPerProcess)) {
      this.filtersPerProcess[this.thisProcess] = [];
    }
  }

  retrieveFiltersFromLocalStorage() {
    this.filtersPerProcess = localStorage.getItem("filtersPerProcess");
    if (this.filtersPerProcess == null) {
      this.filtersPerProcess = new Object();
    }
    else {
      this.filtersPerProcess = JSON.parse(this.filtersPerProcess);
    }
    this.thisProcess = localStorage.getItem("process");
    if (!(this.thisProcess in this.filtersPerProcess)) {
      this.filtersPerProcess[this.thisProcess] = [];
    }
  }

  addFilter(filter_type : string, filter_value : any) {
    let httpParams : HttpParams = new HttpParams();
    this.thisProcess  = localStorage.getItem("process");
    console.log(this.filtersPerProcess);
    if (this.filtersPerProcess == null) {
      this.filtersPerProcess = new Object();
    }
    console.log(this.filtersPerProcess);
    if (!(this.thisProcess in this.filtersPerProcess)) {
      this.filtersPerProcess[this.thisProcess] = [];
    }
    this.filtersPerProcess[this.thisProcess].push([filter_type, filter_value]);
    localStorage.setItem("filtersPerProcess", JSON.stringify(this.filtersPerProcess));

    this.addFilterPOST([filter_type, filter_value], this.filtersPerProcess[this.thisProcess], httpParams).subscribe(data => {
      console.log("SUCCESS!");
      console.log(this.filtersPerProcess);
      window.location.reload();
    })
  }

  remove(filter) {
    let thisIndex : number = this.filtersPerProcess[this.thisProcess].indexOf(filter, 0);
    this.filtersPerProcess[this.thisProcess].splice(thisIndex, 1);
    localStorage.setItem("filtersPerProcess", JSON.stringify(this.filtersPerProcess));
    let httpParams : HttpParams = new HttpParams();
    this.removeFilterPOST(filter, this.filtersPerProcess[this.thisProcess], httpParams).subscribe(data => {
      console.log("REMOVED!");
      console.log(filter);
      window.location.reload();
    })
  }

  getFilters() {
    return this.filtersPerProcess[this.thisProcess];
  }

  addFilterPOST(filter : any, all_filters : any, parameters : HttpParams) {
    var filter_dictio = {"filter": filter, "all_filters": all_filters};

    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);

    var completeUrl: string = this.webservicePath + "addFilter";

    return this.http.post(completeUrl, filter_dictio, {params: parameters});
  }

  removeFilterPOST(filter : any, all_filters : any, parameters : HttpParams) {
    var filter_dictio = {"filter": filter, "all_filters": all_filters};

    let process = localStorage.getItem("process");
    let sessionId = localStorage.getItem("sessionId");

    parameters = parameters.set("process", process);
    parameters = parameters.set("session", sessionId);

    var completeUrl: string = this.webservicePath + "removeFilter";

    return this.http.post(completeUrl, filter_dictio, {params: parameters});
  }
}
