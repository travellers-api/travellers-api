import { parseReservations } from './parsers';

const html = `<table class="data data_reservehistory link" id="mainTable" name="mainTable">
<tbody><tr>
<th>予約日時</th>
<th>店舗名</th>
<th>サービス名</th>
<th>金額</th>
<th>状況</th>
<th>&nbsp;</th>
</tr>

</tbody><tbody id="main_tbody">
<tr onclick="javascript:redirectOnce('9beJwzsrA0NDQytgAAB2MBow');" id="tr_28911238" class="data_tr">
<td class="day">2023/04/10～<br>2023/04/16</td>

<td class="shop_name">【会員様専用】拠点予約サイト</td>

<td class="name">
【福岡県大川市 / 相部屋（男女共用）】Little Okawood
</td>

<td>
</td>

<td class="status last">
<span class="fixed" id="span_status0_28911238">
予約確定


</span>

</td>

<td class="edit last">
<span class="button">
<a id="btn_changestatus2_28911238" class="btn size_s cancel" href="javascript:void(0)" title="" onclick="javascript:$('#rsv_all_time').val('2023/04/10 00:00@2023/04/15 23:59');
reserve_cancel('28911238', '1', '0', '221146', '0');">
キャンセル
</a>
</span>
</td>
</tr>
<tr onclick="javascript:redirectOnce('2feJwzsrA0NDQ0tQQAB2UBpQ');" id="tr_28911159" class="data_tr">
<td class="day">2023/04/05～<br>2023/04/09</td>

<td class="shop_name">【会員様専用】拠点予約サイト</td>

<td class="name">
【岡山県岡山市 / 相部屋（男女共用）】KAMP
</td>

<td>
</td>

<td class="status last">
<span class="fixed" id="span_status0_28911159">
予約確定


</span>

</td>

<td class="edit last">
<span class="button">
<a id="btn_changestatus2_28911159" class="btn size_s cancel" href="javascript:void(0)" title="" onclick="javascript:$('#rsv_all_time').val('2023/04/05 00:00@2023/04/08 23:59');
reserve_cancel('28911159', '1', '0', '221146', '0');">
キャンセル
</a>
</span>
</td>
</tr>
<tr onclick="javascript:redirectOnce('d8eJwzsrA0NDQ0NQEAB2ABoA');" id="tr_28911154" class="data_tr">
<td class="day">2023/04/01～<br>2023/04/05</td>

<td class="shop_name">【会員様専用】拠点予約サイト</td>

<td class="name">
【大阪府豊中市 / 相部屋（男性専用）】日本宿屋168
</td>

<td>
</td>

<td class="status last">
<span class="fixed" id="span_status0_28911154">
予約確定


</span>

</td>

<td class="edit last">
<span class="button">
<a id="btn_changestatus2_28911154" class="btn size_s cancel" href="javascript:void(0)" title="" onclick="javascript:$('#rsv_all_time').val('2023/04/01 00:00@2023/04/04 23:59');
reserve_cancel('28911154', '1', '0', '221146', '0');">
キャンセル
</a>
</span>
</td>
</tr>
<tr onclick="javascript:redirectOnce('2aeJwzsrA0NDAyNAQAB1QBmQ');" id="tr_28910211"  class="data_tr cancel" >
<td class="day">2023/04/13～<br>2023/04/17</td>

<td class="shop_name">【会員様専用】拠点予約サイト</td>

<td class="name">
      【岡山県岡山市 / 相部屋（男女共用）】KAMP
  </td>

<td>
                </td>

<td class="status last">
<span class="fixed" id="span_status0_28910211">
          キャンセル


</span>

  </td>

<td class="edit last">
  </td>
</tr>

</tbody>
</table>`;

test('parseReservations', () => {
  expect(parseReservations(html)).toEqual([
    {
      id: '28911154',
      status: 'approved',
      checkInDate: '2023-04-01',
      checkOutDate: '2023-04-05',
      hotel: {
        name: '日本宿屋168',
        city: '大阪府豊中市',
        roomType: '相部屋（男性専用）',
      },
    },
    {
      id: '28911159',
      status: 'approved',
      checkInDate: '2023-04-05',
      checkOutDate: '2023-04-09',
      hotel: {
        name: 'KAMP',
        city: '岡山県岡山市',
        roomType: '相部屋（男女共用）',
      },
    },
    {
      id: '28911238',
      status: 'approved',
      checkInDate: '2023-04-10',
      checkOutDate: '2023-04-16',
      hotel: {
        name: 'Little Okawood',
        city: '福岡県大川市',
        roomType: '相部屋（男女共用）',
      },
    },
    {
      id: '28910211',
      status: 'canceled',
      checkInDate: '2023-04-13',
      checkOutDate: '2023-04-17',
      hotel: {
        name: 'KAMP',
        city: '岡山県岡山市',
        roomType: '相部屋（男女共用）',
      },
    },
  ]);
});
