import { interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { switchMap, map, catchError } from 'rxjs/operators';

export default class PollingWidget {
  constructor(tbodyId, url) {
    this.tbody = document.getElementById(tbodyId);
    this.url = url;
  }

  init() {
    interval(4000)
      .pipe(
        switchMap(() =>
          ajax.getJSON(this.url).pipe(
            map((response) => response.messages || []),
            catchError(() => of([])),
          ),
        ),
      )
      .subscribe((messages) => {
        messages.forEach((msg) => this.renderMessage(msg));
      });
  }

  formatSubject(subject) {
    if (subject && subject.length > 15) {
      return `${subject.substring(0, 15)}...`;
    }
    return subject;
  }

  formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${hours}:${minutes} ${day}.${month}.${year}`;
  }

  renderMessage(msg) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="color: #007bff; font-weight: 500;">${msg.from}</td>
      <td>${this.formatSubject(msg.subject)}</td>
      <td style="color: #666;">${this.formatDate(msg.received)}</td>
    `;

    this.tbody.insertBefore(row, this.tbody.firstChild);
  }
}
