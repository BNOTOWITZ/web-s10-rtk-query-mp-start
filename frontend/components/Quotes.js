import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setHighlightedQuote,
  toggleVisibility,
} from '../state/quotesSlice'
import { useGetQuotesQuery, useToggleQuoteMutation, useDeleteQuoteMutation } from '../state/quotesApi'

export default function Quotes() {
  const displayAllQuotes = useSelector(st => st.quotesState.displayAllQuotes)
  const highlightedQuote = useSelector(st => st.quotesState.highlightedQuote)
  const dispatch = useDispatch()
  
  const { 
    data: quotes,
    isLoading: gettingQuotes,
    isFetching: refreshingQuotes 
  } = useGetQuotesQuery()
  const [toggleQuote, {isLoading: togglingQuote}] = useToggleQuoteMutation()
  const [deleteQuote, {isLoading: deletingQuote}] = useDeleteQuoteMutation()

  return (
    <div id="quotes">
      <h3>
        Quotes
        {(gettingQuotes || refreshingQuotes) && ' loading...'}
        {(togglingQuote) && ' being toggled...'}
        {(deletingQuote) && ' being deleting...'}
      </h3>
      <div>
        {
          quotes?.filter(qt => {
            return displayAllQuotes || !qt.apocryphal
          })
            .map(qt => (
              <div
                key={qt.id}
                className={`quote${qt.apocryphal ? " fake" : ''}${highlightedQuote === qt.id ? " highlight" : ''}`}
              >
                <div>{qt.quoteText}</div>
                <div>{qt.authorName}</div>
                <div className="quote-buttons">
                  <button onClick={() => deleteQuote(qt.id)}>DELETE</button>
                  <button onClick={() => dispatch(setHighlightedQuote(qt.id))}>HIGHLIGHT</button>
                  <button onClick={() => toggleQuote({ id:qt.id, quote:{apocryphal:!qt.apocryphal} })}>FAKE</button>
                </div>
              </div>
            ))
        }
        {
          !quotes?.length && "No quotes here! Go write some."
        }
      </div>
      {!!quotes?.length && <button onClick={() => dispatch(toggleVisibility())}>
        {displayAllQuotes ? 'HIDE' : 'SHOW'} FAKE QUOTES
      </button>}
    </div>
  )
}