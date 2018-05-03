#!/usr/bin/env python
# -*- coding: utf-8 -*-

import rlp
import os
import time
import logging

from telegram import ChatAction
from telegram.ext import Updater, CommandHandler

from web3 import Web3, HTTPProvider
from ethereum.transactions import Transaction

from preconditions import ignore_if

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO)
logger = logging.getLogger(__name__)

INFURA = 'https://rinkeby.infura.io/'
ETHERSCAN = 'https://rinkeby.etherscan.io/tx/'

BOT_WALLET_PRIVATE_KEY = os.environ['BOT_WALLET_PRIVATE_KEY']
BOT_ADDRESS = os.environ['BOT_ADDRESS']
TELEGRAM_TOKEN = os.environ['TELEGRAM_TOKEN']
INFURA_TOKEN = os.environ['INFURA_TOKEN']

w3 = Web3(HTTPProvider('{}{}'.format(INFURA, INFURA_TOKEN)))


def is_not_private(bot, update):
    return update.effective_chat.type != 'private'


def shouldNotReceive(telegram_user):
    if telegram_user.is_bot:
        return True

    with open('GIVEN.txt') as f:
        users = [x.strip() for x in f.readlines() if x.strip()]

    return str(telegram_user.id) in users


def setReceived(telegram_user):
    with open('GIVEN.txt', 'w') as f:
        f.write('{}\n'.format(telegram_user.id))


def giveMoney(to_addr, eth_amount=1):
    tx = Transaction(
        nonce=w3.eth.getTransactionCount(BOT_ADDRESS),
        gasprice=w3.eth.gasPrice,
        startgas=100000,
        to=to_addr,
        value=int(eth_amount * (10**18)),
        data=b'',
    )

    tx.sign(BOT_WALLET_PRIVATE_KEY)
    raw_tx_hex = w3.toHex(rlp.encode(tx))
    transaction_id = w3.eth.sendRawTransaction(raw_tx_hex)

    return transaction_id


@ignore_if(is_not_private)
def start(bot, update):
    first_name = update.message.from_user.first_name
    update.message.reply_text('Olá {}'.format(first_name))
    update.message.reply_text('Para receberes ethers escreve:')
    update.message.reply_text('/gimme 0x{YOUR_ETHEREUM_WALLET_ADDRESS}')


def gimme(bot, update):
    bot.send_chat_action(
        chat_id=update.effective_chat.id, action=ChatAction.TYPING)

    if shouldNotReceive(update.message.from_user):
        time.sleep(1)
        update.message.reply_text('Já recebeste a tua parte. /e_agora')
        return

    r = update.message.text.split()
    if len(r) < 2:
        if is_not_private(bot, update):
            update.message.reply_text('🗴')
        else:
            update.message.reply_text('Parece me que falta o endereço.')
        return

    if Web3.isAddress(r[1]):
        to_addr = r[1]
        tx_id = giveMoney(to_addr)
        setReceived(update.message.from_user)

        if is_not_private(bot, update):
            update.message.reply_text('✓ {}{}'.format(ETHERSCAN, tx_id))

        else:
            update.message.reply_text('1 ETH enviado.')
            update.message.reply_text('Vê o estado da transacção aqui:')
            update.message.reply_text('{}{}'.format(ETHERSCAN, tx_id))

    elif r[1].lower() == 'all':
        update.message.reply_text('You wish')
    else:
        if is_not_private(bot, update):
            update.message.reply_text('🗴')
        else:
            update.message.reply_text(
                'O endereço que inseriste não é válido. Tenta outra vez')


@ignore_if(is_not_private)
def help(bot, update):
    update.message.reply_text('Para receberes ethers escreve:')
    update.message.reply_text('/gimme 0x{YOUR_ETHEREUM_WALLET_ADDRESS}')


def e_agora(bot, update):
    update.message.reply_text('Vai programar')


def shrugg(bot, update):
    update.message.reply_text('¯\_(ツ)_/¯')


def run_bot():
    updater = Updater(TELEGRAM_TOKEN)
    updater.dispatcher.add_handler(CommandHandler('start', start))
    updater.dispatcher.add_handler(CommandHandler('gimme', gimme))
    updater.dispatcher.add_handler(CommandHandler('help', help))
    updater.dispatcher.add_handler(CommandHandler('e_agora', e_agora))
    updater.dispatcher.add_handler(CommandHandler('shrugg', shrugg))
    updater.start_polling()
    updater.idle()


if __name__ == '__main__':
    run_bot()
