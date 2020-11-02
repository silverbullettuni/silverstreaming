import { Selector } from 'testcafe';

fixture `Getting Started`
    .page `http://localhost:3000/silverstreaming#/home`;

test('My first test', async t => {
    await t
        .click('#TokenGeneratorButton')
        .click('#BroadcastButton')

        .setNativeDialogHandler(() => true)

        // Use the assertion to check if the actual header text is equal to the expected one
    //    .expect(Selector('#article-header').innerText).eql('Thank you, John Smith!');
});