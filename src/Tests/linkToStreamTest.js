import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('linkToStreamTest', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#BroadcastButton')
        .click('#linkToStreamButton')
      
        const viewerVideo = Selector('#viewerVideo').exists;
        await t.expect(viewerVideo).ok();
        
});