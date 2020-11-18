import { Selector } from 'testcafe';

fixture `Smoke test`
    .page `http://localhost:3000/silverstreaming#/home`;

test('tokenGeneratorTest', async t => {
    await t
    
        .click('#TokenGeneratorButton')
        .click('#TokenGeneratorButton')
        .setNativeDialogHandler(() => true)
        .click('#ViewerButton')

});