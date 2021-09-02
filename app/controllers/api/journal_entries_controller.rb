class Api::JournalEntriesController < Api::ApplicationController
  before_action :set_journal_entry, only: [:update, :destroy]

  def update
    @journal_entry.update!(journal_params)
    render "api/journal_entries/update"
  end

  def destroy
    @journal_entry.destroy!
    render "api/journal_entries/destroy"
  end

  private

  def set_journal_entry
    @journal_entry = JournalEntry.find(params[:id])
    authorize @journal_entry
  end

  def journal_params
    params.permit(:body)
  end
end
