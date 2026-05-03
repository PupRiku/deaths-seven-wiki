'use client';

import { useState, useCallback } from 'react';
import type { Combatant } from '@/types';

const CONDITIONS = [
  'Blinded',
  'Charmed',
  'Deafened',
  'Frightened',
  'Grappled',
  'Incapacitated',
  'Invisible',
  'Paralyzed',
  'Petrified',
  'Poisoned',
  'Prone',
  'Restrained',
  'Stunned',
  'Unconscious',
  'Exhaustion',
];

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function hpColor(current: number, max: number) {
  const pct = current / max;
  if (pct > 0.6) return 'healthy';
  if (pct > 0.25) return 'wounded';
  return 'critical';
}

const PRESET_ENEMIES = [
  { name: 'Wrath-Infused Veteran', ac: 16, hp: 58, cr: '3' },
  { name: 'Coin Golem', ac: 14, hp: 52, cr: '3' },
  { name: 'Lust Masked Thrall', ac: 12, hp: 32, cr: '1' },
  { name: 'Baron Avarus', ac: 18, hp: 180, cr: '13' },
  { name: 'The Matriarch', ac: 17, hp: 200, cr: '14' },
  { name: 'General Draven', ac: 22, hp: 350, cr: '20' },
  { name: 'The Aspirant (Phase 1)', ac: 20, hp: 250, cr: '22' },
];

const PARTY = [
  { name: 'Rolando (Mikey)', ac: 17, hp: 35, isPlayer: true },
  { name: 'Michael (Kilt)', ac: 15, hp: 28, isPlayer: true },
  { name: 'Thornvatore (Will)', ac: 18, hp: 42, isPlayer: true },
  { name: 'Drazier (JT)', ac: 14, hp: 30, isPlayer: true },
];

export default function EncounterPage() {
  const [combatants, setCombatants] = useState<Combatant[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [round, setRound] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [newCombatant, setNewCombatant] = useState({
    name: '',
    initiative: '',
    hp: '',
    ac: '',
    isPlayer: false,
    isEnemy: true,
    notes: '',
  });
  const [dmNotesVisible, setDmNotesVisible] = useState(false);

  const sorted = [...combatants].sort((a, b) => b.initiative - a.initiative);

  function addCombatant(c?: Partial<Combatant>) {
    const base = c || {
      name: newCombatant.name,
      initiative: parseInt(newCombatant.initiative) || 0,
      hp: parseInt(newCombatant.hp) || 0,
      maxHp: parseInt(newCombatant.hp) || 0,
      ac: parseInt(newCombatant.ac) || 10,
      isPlayer: newCombatant.isPlayer,
      isEnemy: newCombatant.isEnemy,
      notes: newCombatant.notes,
    };
    const full: Combatant = {
      id: generateId(),
      name: base.name || 'Unknown',
      initiative: base.initiative || 0,
      hp: base.hp || 0,
      maxHp: base.maxHp || base.hp || 0,
      ac: base.ac || 10,
      conditions: [],
      isPlayer: base.isPlayer || false,
      isEnemy: base.isEnemy !== false,
      notes: base.notes || '',
    };
    setCombatants((prev) => [...prev, full]);
    setNewCombatant({
      name: '',
      initiative: '',
      hp: '',
      ac: '',
      isPlayer: false,
      isEnemy: true,
      notes: '',
    });
    setShowAddForm(false);
  }

  function addParty() {
    PARTY.forEach((p) =>
      addCombatant({
        ...p,
        maxHp: p.hp,
        initiative: Math.floor(Math.random() * 20) + 1,
        conditions: [],
        isEnemy: false,
      }),
    );
  }

  function addPreset(preset: (typeof PRESET_ENEMIES)[0]) {
    addCombatant({
      name: preset.name,
      hp: preset.hp,
      maxHp: preset.hp,
      ac: preset.ac,
      initiative: Math.floor(Math.random() * 20) + 1,
      isPlayer: false,
      isEnemy: true,
      conditions: [],
      notes: `CR ${preset.cr}`,
    });
    setShowPresets(false);
  }

  function updateHP(id: string, delta: number) {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) }
          : c,
      ),
    );
  }

  function setHP(id: string, val: number) {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, val)) } : c,
      ),
    );
  }

  function toggleCondition(id: string, condition: string) {
    setCombatants((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              conditions: c.conditions.includes(condition)
                ? c.conditions.filter((x) => x !== condition)
                : [...c.conditions, condition],
            }
          : c,
      ),
    );
  }

  function removeCombatant(id: string) {
    setCombatants((prev) => {
      const next = prev.filter((c) => c.id !== id);
      if (currentTurn >= next.length) setCurrentTurn(0);
      return next;
    });
  }

  function nextTurn() {
    const s = sorted;
    if (s.length === 0) return;
    const next = (currentTurn + 1) % s.length;
    if (next === 0) setRound((r) => r + 1);
    setCurrentTurn(next);
  }

  function prevTurn() {
    const s = sorted;
    if (s.length === 0) return;
    if (currentTurn === 0) {
      setRound((r) => Math.max(1, r - 1));
      setCurrentTurn(s.length - 1);
    } else {
      setCurrentTurn(currentTurn - 1);
    }
  }

  function reset() {
    setCombatants([]);
    setCurrentTurn(0);
    setRound(1);
    setIsActive(false);
  }

  const activeCombatant = sorted[currentTurn];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-base)',
          display: 'flex',
          gap: '0.75rem',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            color: 'var(--text-accent)',
            letterSpacing: '0.1em',
          }}
        >
          ⚔️ ENCOUNTER TRACKER
        </div>
        {isActive && (
          <div
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.8rem',
              color: 'var(--gold)',
              letterSpacing: '0.1em',
            }}
          >
            ROUND {round}
            {activeCombatant && (
              <span
                style={{
                  color: 'var(--text-secondary)',
                  marginLeft: '0.75rem',
                }}
              >
                → {activeCombatant.name}
              </span>
            )}
          </div>
        )}
        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
          }}
        >
          {!isActive ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsActive(true)}
              disabled={combatants.length === 0}
            >
              ▶ Start Combat
            </button>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={prevTurn}>
                ← Prev
              </button>
              <button className="btn btn-primary" onClick={nextTurn}>
                Next →
              </button>
            </>
          )}
          <button
            className="btn btn-ghost"
            onClick={() => setShowPresets(!showPresets)}
          >
            + Enemy Preset
          </button>
          <button className="btn btn-ghost" onClick={addParty}>
            + Party
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            + Custom
          </button>
          <button className="btn btn-danger" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {/* Presets dropdown */}
      {showPresets && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          {PRESET_ENEMIES.map((p) => (
            <button
              key={p.name}
              className="btn btn-ghost"
              style={{
                fontSize: '0.68rem',
                borderColor: '#c0392b44',
                color: '#c0392b',
              }}
              onClick={() => addPreset(p)}
            >
              + {p.name}
            </button>
          ))}
        </div>
      )}

      {/* Add form */}
      {showAddForm && (
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {[
            { key: 'name', label: 'Name', w: '180px' },
            { key: 'initiative', label: 'Init', w: '60px', type: 'number' },
            { key: 'hp', label: 'HP', w: '60px', type: 'number' },
            { key: 'ac', label: 'AC', w: '60px', type: 'number' },
          ].map(({ key, label, w, type }) => (
            <div
              key={key}
              style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}
            >
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.1em',
                }}
              >
                {label}
              </label>
              <input
                type={type || 'text'}
                value={(newCombatant as unknown as Record<string, string>)[key]}
                onChange={(e) =>
                  setNewCombatant((n) => ({ ...n, [key]: e.target.value }))
                }
                style={{
                  width: w,
                  background: 'var(--bg-raised)',
                  border: '1px solid var(--border)',
                  borderRadius: '3px',
                  padding: '0.3rem 0.5rem',
                  color: 'var(--text-primary)',
                  fontFamily:
                    key === 'name' ? 'var(--font-body)' : 'var(--font-mono)',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
          ))}
          <label
            style={{
              display: 'flex',
              gap: '0.3rem',
              alignItems: 'center',
              fontFamily: 'var(--font-heading)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            <input
              type="checkbox"
              checked={newCombatant.isPlayer}
              onChange={(e) =>
                setNewCombatant((n) => ({
                  ...n,
                  isPlayer: e.target.checked,
                  isEnemy: !e.target.checked,
                }))
              }
            />{' '}
            PC
          </label>
          <button className="btn btn-primary" onClick={() => addCombatant()}>
            Add
          </button>
          <button
            className="btn btn-ghost"
            onClick={() => setShowAddForm(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Combatant list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        {combatants.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--text-muted)',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>⚔️</div>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
              }}
            >
              No combatants yet
            </div>
            <div style={{ fontSize: '0.85rem', marginTop: '0.4rem' }}>
              Add the party or enemies to begin
            </div>
          </div>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {sorted.map((c, idx) => {
            const isCurrent = isActive && idx === currentTurn;
            const hpPct = Math.max(0, (c.hp / c.maxHp) * 100);
            const hpCls = hpColor(c.hp, c.maxHp);

            return (
              <div
                key={c.id}
                className={`combatant-row ${isCurrent ? 'active' : ''} ${c.isPlayer ? 'player' : ''} ${c.isEnemy ? 'enemy' : ''}`}
                style={{
                  flexDirection: 'column',
                  gap: '0.5rem',
                  padding: isCurrent ? '0.75rem 1rem' : '0.5rem 0.75rem',
                }}
              >
                {/* Main row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    width: '100%',
                  }}
                >
                  {/* Initiative */}
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1rem',
                      color: isCurrent
                        ? 'var(--gold)'
                        : 'var(--text-secondary)',
                      width: '2.5rem',
                      textAlign: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {c.initiative}
                  </div>

                  {/* Name */}
                  <div
                    style={{
                      flex: 1,
                      fontFamily: c.isPlayer
                        ? 'var(--font-heading)'
                        : 'var(--font-body)',
                      fontSize: '0.95rem',
                      color: isCurrent
                        ? 'var(--gold-bright)'
                        : 'var(--text-primary)',
                    }}
                  >
                    {c.name}
                    {c.isPlayer && (
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.6rem',
                          color: 'var(--cyan)',
                          marginLeft: '0.5rem',
                          letterSpacing: '0.1em',
                        }}
                      >
                        PC
                      </span>
                    )}
                  </div>

                  {/* AC */}
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      letterSpacing: '0.06em',
                      flexShrink: 0,
                    }}
                  >
                    AC {c.ac}
                  </div>

                  {/* HP controls */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexShrink: 0,
                    }}
                  >
                    <button
                      onClick={() => updateHP(c.id, -1)}
                      style={{
                        background: 'none',
                        border: '1px solid #c0392b44',
                        color: '#c0392b',
                        borderRadius: '3px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      −
                    </button>
                    <div style={{ textAlign: 'center', minWidth: '70px' }}>
                      <input
                        type="number"
                        value={c.hp}
                        onChange={(e) =>
                          setHP(c.id, parseInt(e.target.value) || 0)
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          color:
                            c.hp === 0
                              ? '#c0392b'
                              : hpCls === 'healthy'
                                ? '#27ae60'
                                : hpCls === 'wounded'
                                  ? '#f39c12'
                                  : '#c0392b',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.95rem',
                          width: '40px',
                          textAlign: 'center',
                          outline: 'none',
                        }}
                      />
                      <span
                        style={{
                          color: 'var(--text-muted)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                        }}
                      >
                        /{c.maxHp}
                      </span>
                    </div>
                    <button
                      onClick={() => updateHP(c.id, 1)}
                      style={{
                        background: 'none',
                        border: '1px solid #27ae6044',
                        color: '#27ae60',
                        borderRadius: '3px',
                        width: '24px',
                        height: '24px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeCombatant(c.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0 0.25rem',
                    }}
                  >
                    ×
                  </button>
                </div>

                {/* HP bar */}
                <div className="hp-bar" style={{ width: '100%' }}>
                  <div
                    className={`hp-bar-fill ${hpCls}`}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>

                {/* Conditions */}
                <div
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}
                >
                  {c.conditions.map((cond) => (
                    <span
                      key={cond}
                      className="badge"
                      style={{
                        color: '#f39c12',
                        borderColor: '#f39c1244',
                        background: '#f39c1211',
                        cursor: 'pointer',
                        fontSize: '0.6rem',
                      }}
                      onClick={() => toggleCondition(c.id, cond)}
                    >
                      {cond} ×
                    </span>
                  ))}
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) toggleCondition(c.id, e.target.value);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontFamily: 'var(--font-heading)',
                      fontSize: '0.6rem',
                      cursor: 'pointer',
                      outline: 'none',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <option value="">+ condition</option>
                    {CONDITIONS.filter(
                      (cond) => !c.conditions.includes(cond),
                    ).map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                {c.notes && (
                  <div
                    style={{
                      fontSize: '0.82rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                    }}
                  >
                    {c.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
