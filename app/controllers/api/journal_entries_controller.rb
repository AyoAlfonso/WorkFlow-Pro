class Api::JournalEntriesController < Api::ApplicationController
  include UserActivityLogHelper
  after_action :record_activities, only: [:update, :destroy]
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

  def record_activities
    record_activity(params[:note])
  end 
end
