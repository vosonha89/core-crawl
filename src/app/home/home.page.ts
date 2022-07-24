import { Component, OnInit } from '@angular/core';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { LazadaItem } from '../../services/response/lazadaItem';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public lazadaItemLink = '';
  public lazadaItems: LazadaItem[] = [];
  constructor(public http: HTTP) {
  }

  public ngOnInit(): void {
    const me = this;
    me.getLazadaLocalItems();
  }

  public getLazadaItem(): void {
    const me = this;
    const url = me.lazadaItemLink;
    me.http.get(url, {}, {})
      .then(data => {
        const index = (data.data as string).indexOf('function autoJump(){');
        if (index >= 0) {
          const htmlObject = document.createElement('div');
          htmlObject.innerHTML = data.data;
          const link = htmlObject.querySelector('link[rel="origin"]') as HTMLLinkElement;
          if (link && link.href) {
            me.lazadaItemLink = link.href;
            me.getLazadaItem();
          }
          else {
            alert('Cannot get data');
          }
        }
        else {
          const jsonData = data.data as string;
          const re = /<script\b[^>]*>[\s\S]*?<\/script\b[^>]*>/g;
          const results = jsonData.match(re);
          const lazadaItems: string[] = [];
          for (const script of results) {
            if (script.indexOf('<script type="application/ld+json">') >= 0) {
              lazadaItems.push(script);
            }
          }
          const lazadaItemJson = lazadaItems[0].replace('<script type="application/ld+json">', '').replace('</script>', '');
          const lazadaItem = JSON.parse(lazadaItemJson) as LazadaItem;
          lazadaItem.image = 'https:' + lazadaItem.image;
          if (!localStorage.getItem('lazada_' + lazadaItem.sku)) {
            localStorage.setItem('lazada_' + lazadaItem.sku, JSON.stringify(lazadaItem));
            me.getLazadaLocalItems();
          }
        }
        me.lazadaItemLink = '';
      })
      .catch(error => {
        alert(error);
        me.lazadaItemLink = '';
      });
  }

  public getLazadaLocalItems(): void {
    const me = this;
    me.lazadaItems = [];
    for (const [key, value] of Object.entries(localStorage)) {
      if (key.includes('lazada_')) {
        const lazadaItem = JSON.parse(value) as LazadaItem;
        me.lazadaItems.push(lazadaItem);
      }
    }
  }

  public removeLazadaItem(sku: string): void {
    const me = this;
    const lazadaItemJson = localStorage.getItem('lazada_' + sku);
    if (lazadaItemJson) {
      localStorage.removeItem('lazada_' + sku);
      me.getLazadaLocalItems();
    }
  }
}
