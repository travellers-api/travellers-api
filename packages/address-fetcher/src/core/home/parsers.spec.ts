import { parseHomePage } from './parsers';

const html = `      <div class="l-home-inner">
        <h2 id="room">部屋</h2>
        <div id="room-calendar" class="room-area mt-4 mb-5">
            
<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 1号室の写真" src="https://cdn.address.love/uploads/images/room/photo/540/adb29163-00e9-48cf-bebf-34bd902604f6.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 1号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>シングルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-calendar-ec4ed2f6654cb2d9d3753eaa75dd6787.svg" />
          <p>予約の埋まりやすい部屋 <a target="_blank" rel="noopener" href="https://address-membersupport.zendesk.com/hc/ja/articles/19926413192217">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 26 26" fill="none" stroke="#CF761D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </a></p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>扉・廊下を挟んで窓があるタイプの部屋です　※個室内には窓がありませんのでご注意ください</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-540"
              data-bs-room-id="540">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-540"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:540,&quot;name&quot;:&quot;シングルルーム 1号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/540"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 2号室の写真" src="https://cdn.address.love/uploads/images/room/photo/541/37964e0e-5c1d-472e-ac3e-47d85810b3af.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 2号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>シングルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>扉・廊下を挟んで窓があるタイプの部屋です　※個室内には窓がありませんのでご注意ください</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-541"
              data-bs-room-id="541">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-541"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:541,&quot;name&quot;:&quot;シングルルーム 2号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/541"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 3号室の写真" src="https://cdn.address.love/uploads/images/room/photo/542/0a32ffbc-75b3-4d2b-8a32-e229616019ab.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 3号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>シングルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>扉・廊下を挟んで窓があるタイプの部屋です　※個室内には窓がありませんのでご注意ください</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-542"
              data-bs-room-id="542">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-542"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:542,&quot;name&quot;:&quot;シングルルーム 3号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/542"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 4号室の写真" src="https://cdn.address.love/uploads/images/room/photo/543/a958f766-3b1f-4e09-8089-33591006a2aa.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 4号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>シングルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>扉・廊下を挟んで窓があるタイプの部屋です　※個室内には窓がありませんのでご注意ください</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-543"
              data-bs-room-id="543">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-543"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:543,&quot;name&quot;:&quot;シングルルーム 4号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/543"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 5号室の写真" src="https://cdn.address.love/uploads/images/room/photo/544/77101ca3-d98d-416c-81f5-e052a6f9c143.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 5号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>シングルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>扉・廊下を挟んで窓があるタイプの部屋です　※個室内には窓がありませんのでご注意ください</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-544"
              data-bs-room-id="544">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-544"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:544,&quot;name&quot;:&quot;シングルルーム 5号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/544"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="ツインルーム 8号室の写真" src="https://cdn.address.love/uploads/images/room/photo/547/bee58d92-979e-4475-bd5e-66c367782d58.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>ツインルーム 8号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員2名）</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>セミダブルベッド x 2</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア × 2</p>
        </li>
    </ul>
      <div class="text-xs mt-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 25 25" fill="none" stroke="#950008" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span>※1名でのご予約は、原則シングルルームをご利用ください。同伴者利用料：1,000円（1名1日につき。幼児無料） ※家守に現地で精算</span>
      </div>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#-room-reserve-calendar-modal-547"
              data-bs-room-id="547">
        予約する
      </button>
  </div>
</div>

  <div id="-room-reserve-calendar-modal-547"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:547,&quot;name&quot;:&quot;ツインルーム 8号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/547"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="false"></room-reserve-calendar>
    </div>
  </div>

          
          
          
<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 6号室の写真" src="https://cdn.address.love/uploads/images/room/photo/545/29206566-32c8-468a-8ec7-2881e185eff5.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 6号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
          <p class="room-item-info-label">女性専用</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>セミダブルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-white"
              data-bs-toggle="modal"
              data-bs-target="#unreservable-room-reserve-calendar-modal-545"
              data-bs-room-id="545">
        空室確認
      </button>
        <p class="text-xs text-bold lh-base mt-2">本アカウントでは<br class="pc">選択できません</p>
  </div>
</div>

  <div id="unreservable-room-reserve-calendar-modal-545"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:545,&quot;name&quot;:&quot;シングルルーム 6号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/545"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="true"></room-reserve-calendar>
    </div>
  </div>

<div class="room-item">
  <div class="room-item-imagearea">
    <div class="room-item-image">
        <img alt="シングルルーム 7号室の写真" src="https://cdn.address.love/uploads/images/room/photo/546/b2d77572-35e4-4ec2-b7f3-f6b0bf4d3de3.jpg" />
    </div>
  </div>
  <div class="room-item-infoarea">
    <h3>シングルルーム 7号室</h3>
    <ul class="room-item-info">
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-door-02adaffdf81748771ba74711093a0dbe.svg" />
        <p>個室（定員1名）</p>
          <p class="room-item-info-label">女性専用</p>
      </li>
      <li>
        <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-bed-59eceed33c45c6160f6bb65080067645.svg" />
        <p><p>セミダブルベッド x 1</p></p>
      </li>
        <li>
          <img class="icon" src="https://cdn.address.love/packs/media/images/Icon-desk-ea449e88a508416c176a372fe3a8a558.svg" />
          <p>デスク/チェア</p>
        </li>
    </ul>
  </div>
  <div class="room-item-btnarea text-center">
      <button class="btn btn-white"
              data-bs-toggle="modal"
              data-bs-target="#unreservable-room-reserve-calendar-modal-546"
              data-bs-room-id="546">
        空室確認
      </button>
        <p class="text-xs text-bold lh-base mt-2">本アカウントでは<br class="pc">選択できません</p>
  </div>
</div>

  <div id="unreservable-room-reserve-calendar-modal-546"
       class="modal fade calendar-modal"
       tabindex="-1"
       aria-labelledby="roomReserveCalendarModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-fullscreen-md-down modal-dialog-centered">
        <room-reserve-calendar
          :room="{&quot;id&quot;:546,&quot;name&quot;:&quot;シングルルーム 7号室&quot;}"
          :default-data="{&quot;home_ids&quot;:[292],&quot;check_in_date&quot;:null,&quot;check_out_date&quot;:null,&quot;adult&quot;:1,&quot;child&quot;:0,&quot;preschooler&quot;:0,&quot;room_count&quot;:1,&quot;kinds&quot;:null,&quot;has_desk_chair&quot;:null,&quot;sex&quot;:&quot;male&quot;,&quot;private_kind&quot;:null,&quot;dormitory_kind&quot;:null,&quot;multi_reservation&quot;:null,&quot;ticket_amount&quot;:null,&quot;exclude_popular&quot;:null}"
          :is-contracted="true"
          :upgrade-offer="null"
          reservation-path="/reservations/new"
          plan-change-path="/mypage/plan"
          room-api-path="/api/v1/web/rooms/546"
          :selected-check-in-date="selectedCheckInDate"
          :selected-check-out-date="selectedCheckOutDate"
          :registration-tickets="[{&quot;id&quot;:&quot;512_&quot;,&quot;plan&quot;:&quot;きほんのプラン&quot;,&quot;ticket&quot;:&quot;&quot;,&quot;start_date&quot;:&quot;2021-08-16&quot;,&quot;end_date&quot;:null,&quot;period_str&quot;:&quot;2021/08/16~&quot;,&quot;tickets_str&quot;:&quot;6日&quot;}]"
          :is-multi-reserve="false"
          :is-mismatch-sex="true"></room-reserve-calendar>
    </div>
  </div>

        </div>

        <div class="text-right">
          <svg style="margin-top:3px;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28" fill="none" stroke="#CF761D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <a class="btn btn-text2 text-sub" rel="noopener" target="_blank" href="https://sites.google.com/address.love/popup/guide/accompany">定員数と大人、子ども、幼児について</a>
        </div>
        <div class="text-right">
          <svg style="margin-top:3px;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 28 28" fill="none" stroke="#CF761D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
          <a class="btn btn-text2 text-sub" rel="noopener" target="_blank" href="https://address-membersupport.zendesk.com/hc/ja/articles/15086006405913">部屋の予約可能期間について</a>
        </div>
      </div>`;

describe('parseHomePage', () => {
  test('rooms', async () => {
    const { rooms } = parseHomePage(html);
    expect(rooms).toEqual([
      {
        id: 540,
        name: 'シングルルーム 1号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/540/adb29163-00e9-48cf-bebf-34bd902604f6.jpg',
        type: '個室',
        capacity: 1,
        sex: null,
        calendar: null,
      },
      {
        id: 541,
        name: 'シングルルーム 2号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/541/37964e0e-5c1d-472e-ac3e-47d85810b3af.jpg',
        type: '個室',
        capacity: 1,
        sex: null,
        calendar: null,
      },
      {
        id: 542,
        name: 'シングルルーム 3号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/542/0a32ffbc-75b3-4d2b-8a32-e229616019ab.jpg',
        type: '個室',
        capacity: 1,
        sex: null,
        calendar: null,
      },
      {
        id: 543,
        name: 'シングルルーム 4号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/543/a958f766-3b1f-4e09-8089-33591006a2aa.jpg',
        type: '個室',
        capacity: 1,
        sex: null,
        calendar: null,
      },
      {
        id: 544,
        name: 'シングルルーム 5号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/544/77101ca3-d98d-416c-81f5-e052a6f9c143.jpg',
        type: '個室',
        capacity: 1,
        sex: null,
        calendar: null,
      },
      {
        id: 547,
        name: 'ツインルーム 8号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/547/bee58d92-979e-4475-bd5e-66c367782d58.jpg',
        type: '個室',
        capacity: 2,
        sex: null,
        calendar: null,
      },
      {
        id: 545,
        name: 'シングルルーム 6号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/545/29206566-32c8-468a-8ec7-2881e185eff5.jpg',
        type: '個室',
        capacity: 1,
        sex: 'female',
        calendar: null,
      },
      {
        id: 546,
        name: 'シングルルーム 7号室',
        thumbnail: 'https://cdn.address.love/uploads/images/room/photo/546/b2d77572-35e4-4ec2-b7f3-f6b0bf4d3de3.jpg',
        type: '個室',
        capacity: 1,
        sex: 'female',
        calendar: null,
      },
    ]);
  });
});
