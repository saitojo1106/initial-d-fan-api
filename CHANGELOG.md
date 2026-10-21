# Changelog

## 0.2.0 — 2026-10-21

- Second Stageの主要対戦5件、ドライバー3名、車種3件、峠名2件を追加。合計は12対戦・10名・10車種・5峠。
- 全バトルに`stage`（`first-stage` / `second-stage`）を追加。`GET /api/v1/battles?stage=second-stage`で絞り込めます。
- 既存のID・エンドポイント・レスポンスの外枠を維持。`stage`省略時は全対戦、キャラクター戦績も全Stageの合算です。
- 拓海の戦績は8勝1敗・9対戦になります。赤城の京一戦のエンジンブローを敗戦として数えます。
- 外部クライアントでバトルのJSONを厳密検証している場合は、新しい`stage`フィールドを許容してください。
- 出典の対応と収録外の範囲は[Second Stageデータ確認メモ](docs/second-stage-sources.md)を参照。
