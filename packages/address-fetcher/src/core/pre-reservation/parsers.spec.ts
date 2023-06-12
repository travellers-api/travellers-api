import { parsePreReservation } from './parsers';

describe('parsePreReservation', () => {
  test('errors', async () => {
    const html = `        <div class="alert-area-wrap">
    <div class="alert-area">
      <div class="alert alert-danger mb-0">
        <p class="h5">エラー</p>
        <ul>
            <li>選択した期間は既に予約されています。他の日程を選択ください。</li>
            <li>選択した期間は現在予約中または予約申請中のため予約できません。</li>
            <li>1つの家に1か月間に予約できる日数を超過しています</li>
            <li>予約可能なチケット数を超えています。</li>
        </ul>
      </div>
        <div class="mt-3">
          <p>チケットが不足しがちな方は、チケット数に余裕のある「たっぷりプラン」を検討してみませんか？</p>
          <p class="edit-link">
            <a class="btn-text arrow-r-orange" target="_blank" rel="noopener" href="https://form.run/@switchplan?from=reservation-form">たっぷりプランへの変更申請</a>
          </p>
        </div>
    </div>
  </div>
`;
    const { errors } = parsePreReservation(html);
    expect(errors).toEqual([
      '選択した期間は既に予約されています。他の日程を選択ください。',
      '選択した期間は現在予約中または予約申請中のため予約できません。',
      '1つの家に1か月間に予約できる日数を超過しています',
      '予約可能なチケット数を超えています。',
    ]);
  });
});
