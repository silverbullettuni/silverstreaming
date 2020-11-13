import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('switchStreamTest', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#BroadcastButton')
        .click('#2')

        await t
        .expect(Selector('#currentParticipantId').innerText).eql('2', 'string contains the expected substring')        
});