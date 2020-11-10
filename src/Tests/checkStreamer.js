import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('checkStreamer', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#BroadcastButton')

        const streamerVideo = Selector('#streamerVideo').exists;
        await t.expect(streamerVideo).ok();
        
});