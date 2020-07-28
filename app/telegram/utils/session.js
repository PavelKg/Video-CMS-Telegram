const logger = require('./logger')

// type SessionDataField = 'settingsScene' | 'language';

/**
 * Saving data to the session
 * @param ctx - telegram context
 * @param field - field to store in
 * @param data - data to store
 */
const saveToSession = function (ctx, field, data) {
  logger.debug(ctx, 'Saving %s to session', field)
  ctx.session[field] = data
}

/**
 * Removing data from the session
 * @param ctx - telegram context
 * @param field - field to delete
 */
const deleteFromSession = function (ctx, field) {
  logger.debug(ctx, 'Deleting %s from session', field)
  delete ctx.session[field]
}

module.exports = {deleteFromSession, saveToSession}
