'use client';

import { useState } from 'react';

function calculateShares({ estateValue, spouseType, sonsCount, daughtersCount, fatherAlive, motherAlive }) {
  const hasChildren = sonsCount > 0 || daughtersCount > 0;
  const shares = [];
  let remaining = 1;

  if (spouseType === 'husband') {
    const frac = hasChildren ? 1 / 4 : 1 / 2;
    shares.push({ heir: 'Husband', fraction: frac, count: 1 });
    remaining -= frac;
  } else if (spouseType === 'wife') {
    const frac = hasChildren ? 1 / 8 : 1 / 4;
    shares.push({ heir: 'Wife (or wives, combined)', fraction: frac, count: 1 });
    remaining -= frac;
  }

  let fatherFixedShare = 0;
  if (fatherAlive && hasChildren) {
    fatherFixedShare = 1 / 6;
    shares.push({ heir: 'Father', fraction: fatherFixedShare, count: 1 });
    remaining -= fatherFixedShare;
  }

  if (motherAlive) {
    const frac = hasChildren ? 1 / 6 : 1 / 3;
    shares.push({ heir: 'Mother', fraction: frac, count: 1 });
    remaining -= frac;
  }

  if (hasChildren) {
    const units = sonsCount * 2 + daughtersCount;
    if (units > 0 && remaining > 0) {
      const perUnit = remaining / units;
      if (sonsCount > 0) {
        shares.push({ heir: 'Each Son', fraction: perUnit * 2, count: sonsCount });
      }
      if (daughtersCount > 0) {
        shares.push({ heir: 'Each Daughter', fraction: perUnit, count: daughtersCount });
      }
    }
    remaining = 0;
  } else if (fatherAlive) {
    const idx = shares.findIndex((s) => s.heir === 'Father');
    if (idx >= 0) {
      shares[idx].fraction += remaining;
    } else {
      shares.push({ heir: 'Father', fraction: remaining, count: 1 });
    }
    remaining = 0;
  }

  return { shares, remaining, hasResiduaryFallback: !hasChildren && !fatherAlive && remaining > 0 };
}

export default function InheritanceCalculator() {
  const [estateValue, setEstateValue] = useState('');
  const [spouseType, setSpouseType] = useState('none');
  const [sonsCount, setSonsCount] = useState(0);
  const [daughtersCount, setDaughtersCount] = useState(0);
  const [fatherAlive, setFatherAlive] = useState(false);
  const [motherAlive, setMotherAlive] = useState(false);
  const [result, setResult] = useState(null);

  const handleCalculate = (e) => {
    e.preventDefault();
    const value = parseFloat(estateValue) || 0;
    const calc = calculateShares({
      estateValue: value, spouseType, sonsCount: Number(sonsCount),
      daughtersCount: Number(daughtersCount), fatherAlive, motherAlive,
    });
    setResult({ ...calc, estateValue: value });
  };

  return (
    <div>
      <div
        style={{
          background: '#fff8e1', border: '1px solid #e4c869', borderRadius: 3,
          padding: 16, marginBottom: 24, fontSize: '0.88rem',
        }}
      >
        <strong>Important:</strong> This calculator covers common family scenarios under Islamic
        inheritance law (Ilm al-Fara&apos;id) — spouse, children, and parents. It does{' '}
        <strong>not</strong> handle more complex situations: grandchildren inheriting in place of
        a predeceased child, surviving siblings, multiple wives with unequal shares, proportional
        adjustment when shares exceed the estate (awl), or redistribution when shares are less
        than the estate with no residuary heir (radd). For any real estate distribution, consult
        a licensed advocate or a qualified Islamic scholar familiar with Fara&apos;id calculation.
      </div>

      <form onSubmit={handleCalculate} className="form-card" style={{ maxWidth: 500 }}>
        <div className="form-row">
          <label>Total Estate Value (PKR)</label>
          <input
            type="number" min="0" required value={estateValue}
            onChange={(e) => setEstateValue(e.target.value)}
            placeholder="e.g. 10000000"
          />
        </div>

        <div className="form-row">
          <label>Surviving Spouse</label>
          <select value={spouseType} onChange={(e) => setSpouseType(e.target.value)}>
            <option value="none">None</option>
            <option value="husband">Husband</option>
            <option value="wife">Wife (or wives)</option>
          </select>
        </div>

        <div className="form-row">
          <label>Number of Sons</label>
          <input type="number" min="0" value={sonsCount} onChange={(e) => setSonsCount(e.target.value)} />
        </div>

        <div className="form-row">
          <label>Number of Daughters</label>
          <input type="number" min="0" value={daughtersCount} onChange={(e) => setDaughtersCount(e.target.value)} />
        </div>

        <div className="form-row">
          <label>
            <input type="checkbox" checked={fatherAlive} onChange={(e) => setFatherAlive(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />
            Father is surviving
          </label>
        </div>

        <div className="form-row">
          <label>
            <input type="checkbox" checked={motherAlive} onChange={(e) => setMotherAlive(e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />
            Mother is surviving
          </label>
        </div>

        <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '10px 28px' }}>
          Calculate Shares
        </button>
      </form>

      {result && (
        <div className="form-card" style={{ maxWidth: 500, marginTop: 20 }}>
          <h3 style={{ marginTop: 0, fontSize: '1.05rem' }}>Estimated Shares</h3>
          {result.shares.length === 0 ? (
            <p>No heirs selected.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line)', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px' }}>Heir</th>
                  <th style={{ padding: '6px 4px' }}>Share (fraction)</th>
                  <th style={{ padding: '6px 4px' }}>Amount (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {result.shares.map((s, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--line)' }}>
                    <td style={{ padding: '6px 4px' }}>{s.heir}</td>
                    <td style={{ padding: '6px 4px' }}>{(s.fraction * 100).toFixed(2)}%</td>
                    <td style={{ padding: '6px 4px' }}>
                      {Math.round(s.fraction * result.estateValue).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {result.hasResiduaryFallback && (
            <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--danger, #b91c1c)' }}>
              No children or father specified to absorb the remaining estate — this scenario
              likely involves siblings or extended family as residuary heirs, which this
              calculator does not cover. Please consult an advocate.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
