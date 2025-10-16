import { Quote } from './quotesData';

/**
 * Determines if a quote is fully verified based on completeness of required fields
 * A quote is only considered verified if it has:
 * - Evidence image
 * - Complete source information
 * - Verification status set to 'verified' (if present)
 */
export function isQuoteVerified(quote: Quote): boolean {
  // Must have evidence image
  if (!quote.evidenceImage) {
    return false;
  }

  // Check verification status if it exists
  if (quote.attributionStatus && quote.attributionStatus !== 'verified') {
    return false;
  }

  // Must have source information
  const hasSourceInfo = quote.sourceInfo && Object.keys(quote.sourceInfo).length > 0;
  const hasLegacySource = quote.source || quote.sourceUrl;
  
  if (!hasSourceInfo && !hasLegacySource) {
    return false;
  }

  // If sourceInfo exists, check for required fields
  if (hasSourceInfo && quote.sourceInfo) {
    const { source_type, title, primary_url, verification_status } = quote.sourceInfo;
    
    // Must have basic source metadata
    if (!source_type || !title) {
      return false;
    }

    // Must have at least one URL
    if (!primary_url && !quote.sourceInfo.backup_url) {
      return false;
    }

    // Check verification status if present in source_info
    if (verification_status && verification_status !== 'verified') {
      return false;
    }
  }

  // Must have author information
  if (!quote.author || quote.author.trim() === '') {
    return false;
  }

  // Must have date information
  if (!quote.date && !quote.sourcePublicationDate && !quote.sourceInfo?.publication_date) {
    return false;
  }

  return true;
}

/**
 * Gets a human-readable reason why a quote is not verified
 */
export function getVerificationIssues(quote: Quote): string[] {
  const issues: string[] = [];

  if (!quote.evidenceImage) {
    issues.push('Missing evidence image');
  }

  if (quote.attributionStatus && quote.attributionStatus !== 'verified') {
    issues.push(`Attribution status: ${quote.attributionStatus}`);
  }

  const hasSourceInfo = quote.sourceInfo && Object.keys(quote.sourceInfo).length > 0;
  const hasLegacySource = quote.source || quote.sourceUrl;
  
  if (!hasSourceInfo && !hasLegacySource) {
    issues.push('Missing source information');
  }

  if (hasSourceInfo && quote.sourceInfo) {
    if (!quote.sourceInfo.source_type) {
      issues.push('Missing source type');
    }
    if (!quote.sourceInfo.title) {
      issues.push('Missing source title');
    }
    if (!quote.sourceInfo.primary_url && !quote.sourceInfo.backup_url) {
      issues.push('Missing source URL');
    }
    if (quote.sourceInfo.verification_status && quote.sourceInfo.verification_status !== 'verified') {
      issues.push(`Source verification: ${quote.sourceInfo.verification_status}`);
    }
  }

  if (!quote.author || quote.author.trim() === '') {
    issues.push('Missing author');
  }

  if (!quote.date && !quote.sourcePublicationDate && !quote.sourceInfo?.publication_date) {
    issues.push('Missing date');
  }

  return issues;
}
