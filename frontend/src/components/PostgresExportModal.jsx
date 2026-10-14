import React, { useState, useEffect } from 'react';
import { X, Database, Download, CheckCircle, FileCode, Copy } from 'lucide-react';

export default function PostgresExportModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/Fashionsearch.sql')
        .then(r => r.text())
        .then(txt => {
          setPreviewContent(txt.slice(0, 3000));
          setLoading(false);
        })
        .catch(() => {
          setPreviewContent(`-- PostgreSQL 17 Database Dump\n-- Database: Fashionsearch\n-- File: Fashionsearch.sql\n\nCREATE TABLE searches (...);\nCREATE TABLE products (...);`);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(previewContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-brand-200 text-left flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 border border-brand-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">PostgreSQL 17 Data Export</h3>
              <p className="text-xs text-slate-500">File: <span className="font-mono font-semibold text-brand-700">Fashionsearch.sql</span></p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="my-4 p-3 rounded-2xl bg-brand-50 border border-brand-100 text-xs text-brand-900 flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Automatic PostgreSQL 17 Sync Active</p>
            <p className="text-brand-700 mt-0.5">
              All costume searches, detected colors, lengths, and price comparison datasets from Amazon & Cuelinks are continually saved to <span className="font-mono font-bold">Fashionsearch.sql</span>.
            </p>
          </div>
        </div>

        {/* Code Preview */}
        <div className="flex-1 min-h-[220px] bg-slate-900 rounded-2xl p-4 overflow-auto font-mono text-xs text-emerald-400 border border-slate-800 relative">
          <pre>{loading ? "Loading SQL data dump..." : previewContent}</pre>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Copied SQL!" : "Copy SQL"}</span>
          </button>

          <a
            href="/api/database/download-sql"
            download="Fashionsearch.sql"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Fashionsearch.sql</span>
          </a>
        </div>
      </div>
    </div>
  );
}
