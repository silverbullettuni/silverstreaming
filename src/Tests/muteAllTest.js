import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('muteAllTest', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#BroadcastButton')
        .click('#muteAllButton')

        
});